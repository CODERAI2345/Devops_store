import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // In-memory LRU cache for scraped metadata (15 minutes TTL)
  const metaCache = new Map<string, { data: any; expiresAt: number }>();
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const MAX_CACHE_ITEMS = 300;

  const getCached = (key: string) => {
    const entry = metaCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      metaCache.delete(key);
      return null;
    }
    return entry.data;
  };

  const setCached = (key: string, data: any) => {
    if (metaCache.size >= MAX_CACHE_ITEMS) {
      const oldestKey = metaCache.keys().next().value;
      if (oldestKey) metaCache.delete(oldestKey);
    }
    metaCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  };

  // Threads metadata extraction endpoint
  app.get("/api/threads-meta", async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl) {
      return res.status(400).json({ error: "url query parameter is required" });
    }

    const cacheKey = `th:${rawUrl.trim().toLowerCase()}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    try {
      let targetUrl = rawUrl.trim();
      if (!targetUrl.startsWith("http")) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (compatible; ThreadsCrawler/1.0)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });

      const html = await response.text();

      const decodeHtmlEntities = (str: string): string => {
        if (!str) return "";
        return str
          .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#064;/g, "@")
          .replace(/&#39;/g, "'");
      };

      const getOg = (prop: string) => {
        const m = html.match(new RegExp('<meta[^>]+property=[\"\']' + prop + '[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', 'i'))
          || html.match(new RegExp('<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']' + prop + '[\"\']', 'i'));
        return m ? decodeHtmlEntities(m[1]) : "";
      };

      const titleRaw = getOg("og:title") || (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "Threads Post";
      const title = decodeHtmlEntities(titleRaw).trim();
      const description = getOg("og:description").trim();
      const image = getOg("og:image");
      const ogUrl = getOg("og:url");

      const shortcodeMatch = html.match(/shortcode=([a-zA-Z0-9_-]+)/i)
        || (ogUrl || targetUrl).match(/\/(?:t|post|share)\/([a-zA-Z0-9_-]+)/i);
      const shortcode = shortcodeMatch ? shortcodeMatch[1] : "";

      const authorMatch = (ogUrl || targetUrl).match(/@([a-zA-Z0-9_.-]+)/)
        || title.match(/@([a-zA-Z0-9_.-]+)/);
      const author = authorMatch ? `@${authorMatch[1]}` : (title.includes("on Threads") ? title.replace(/\s+on Threads.*/i, "") : "Threads User");

      const media: Array<{ url: string; type: "image" | "video"; alt?: string }> = [];
      const images: string[] = [];

      // Extract all carousel photos from Threads post HTML
      const imgMatches = html.match(/<img[\s\S]*?>/gi) || [];
      for (const m of imgMatches) {
        const isProfile = m.includes("t51.82787-19") || m.includes("sizes=\"36px\"") || m.includes("width=\"36\"") || m.includes("profile");
        const isPostPhoto = m.includes("CAROUSEL_ITEM") || m.includes("efg=") || m.includes("t51.82787-15") || m.includes("t39.92108-6");
        if (!isProfile && isPostPhoto) {
          let highestResUrl = "";
          const srcsetMatch = m.match(/srcSet="([^"]+)"/i) || m.match(/srcset="([^"]+)"/i);
          if (srcsetMatch) {
            const parts = srcsetMatch[1].split(",");
            let maxW = 0;
            for (const p of parts) {
              const [srcPart, wStr] = p.trim().split(/\s+/);
              const w = parseInt(wStr) || 0;
              if (w >= maxW) {
                maxW = w;
                highestResUrl = srcPart.replace(/&amp;/g, "&");
              }
            }
          }
          if (!highestResUrl) {
            const srcMatch = m.match(/src="([^"]+)"/i);
            if (srcMatch) highestResUrl = srcMatch[1].replace(/&amp;/g, "&");
          }
          if (highestResUrl && !images.includes(highestResUrl)) {
            images.push(highestResUrl);
            media.push({
              url: highestResUrl,
              type: "image",
              alt: description ? description.slice(0, 100) : title,
            });
          }
        }
      }

      // If no carousel photos found but og:image exists, use it as fallback
      if (images.length === 0 && image) {
        images.push(image);
        media.push({
          url: image,
          type: "image",
          alt: description ? description.slice(0, 100) : title,
        });
      }

      const thumbnail = images.length > 0 ? images[0] : (image || "");

      const resultData = {
        title: title || "Threads Post",
        description: description || "",
        thumbnail,
        images,
        media,
        shortcode,
        author,
        canonicalUrl: ogUrl || targetUrl,
      };

      setCached(cacheKey, resultData);

      return res.json({
        success: true,
        data: resultData,
      });
    } catch (err: any) {
      console.error("Threads meta fetch error:", err);
      return res.status(500).json({ error: err?.message || "Failed to fetch Threads metadata" });
    }
  });

  // General Web & Lab metadata scraping endpoint
  app.get("/api/scrape-meta", async (req, res) => {
    const rawUrl = req.query.url as string;
    const requestedType = req.query.type as string; // "lab" | "web" | undefined
    if (!rawUrl) {
      return res.status(400).json({ error: "url query parameter is required" });
    }

    const cacheKey = `scrape:${(requestedType || 'all')}:${rawUrl.trim().toLowerCase()}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    try {
      let targetUrl = rawUrl.trim();
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });

      const finalUrl = response.url || targetUrl;
      const html = await response.text();

      const decodeHtmlEntities = (str: string): string => {
        if (!str) return "";
        return str
          .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#064;/g, "@")
          .replace(/&#39;/g, "'")
          .trim();
      };

      const getMeta = (names: string[]): string => {
        for (const name of names) {
          const m1 = html.match(new RegExp('<meta[^>]+(?:property|name)=[\"\']' + name + '[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', 'i'));
          if (m1 && m1[1]) return decodeHtmlEntities(m1[1]);
          const m2 = html.match(new RegExp('<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+(?:property|name)=[\"\']' + name + '[\"\']', 'i'));
          if (m2 && m2[1]) return decodeHtmlEntities(m2[1]);
        }
        return "";
      };

      let rawTitle = getMeta(["og:title", "twitter:title"]);
      if (!rawTitle) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) rawTitle = decodeHtmlEntities(titleMatch[1]);
      }

      let description = getMeta(["og:description", "description", "twitter:description"]);
      let image = getMeta(["og:image", "twitter:image", "twitter:image:src"]);
      const siteName = getMeta(["og:site_name"]);
      const author = getMeta(["author", "article:author", "twitter:creator"]);

      // Parse domain and URL details
      let domain = "";
      let hostname = "";
      let pathname = "";
      try {
        const parsed = new URL(finalUrl);
        hostname = parsed.hostname;
        domain = parsed.hostname.replace(/^www\./i, "");
        pathname = parsed.pathname;
      } catch (e) {
        domain = targetUrl.replace(/^https?:\/\//i, "").split("/")[0];
      }

      // Check if title is generic or needs slug fallback
      let title = rawTitle;
      const isGenericTitle = !title || title.toLowerCase() === "course | kodekloud" || title.toLowerCase() === "kodekloud" || title.toLowerCase() === domain.toLowerCase() || title.startsWith("http");
      if (isGenericTitle && pathname) {
        const parts = pathname.split("/").filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length > 3) {
          const cleaned = lastPart
            .replace(/\.[a-z0-9]+$/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\b(?:course|lab|tutorial|learn|youtube)\b/gi, (match) => match.toUpperCase())
            .replace(/\b\w/g, (c) => c.toUpperCase());
          title = cleaned;
        }
      }
      if (!title) {
        title = domain || "Web Resource";
      }

      // Identify platform
      let platform = siteName || "";
      const lowerHost = hostname.toLowerCase();
      const lowerUrl = finalUrl.toLowerCase();
      if (lowerHost.includes("kodekloud") || lowerHost.includes("kode.wiki")) platform = "KodeKloud";
      else if (lowerHost.includes("killercoda")) platform = "Killercoda";
      else if (lowerHost.includes("sadservers")) platform = "SadServers";
      else if (lowerHost.includes("workshops.aws") || (lowerHost.includes("aws.") && lowerUrl.includes("workshop"))) platform = "AWS Workshops";
      else if (lowerHost.includes("skillbuilder.aws")) platform = "AWS Skill Builder";
      else if (lowerHost.includes("cloudskillsboost.google") || lowerHost.includes("qwiklabs")) platform = "Google Cloud Skills Boost";
      else if (lowerHost.includes("learn.microsoft.com")) platform = "Microsoft Learn";
      else if (lowerHost.includes("coursera")) platform = "Coursera";
      else if (lowerHost.includes("udemy")) platform = "Udemy";
      else if (lowerHost.includes("pluralsight")) platform = "Pluralsight";
      else if (lowerHost.includes("tryhackme")) platform = "TryHackMe";
      else if (lowerHost.includes("hackthebox")) platform = "Hack The Box";
      else if (lowerHost.includes("instruqt")) platform = "Instruqt";
      else if (lowerHost.includes("github.com")) platform = "GitHub";
      else if (lowerHost.includes("kubernetes.io")) platform = "Kubernetes";
      else if (lowerHost.includes("hashicorp") || lowerHost.includes("terraform")) platform = "HashiCorp";
      else if (!platform && domain) {
        const first = domain.split(".")[0];
        platform = first.charAt(0).toUpperCase() + first.slice(1);
      }

      // Detect Tags based on URL, title, and description
      const textToAnalyze = `${finalUrl} ${title} ${description}`.toLowerCase();
      const tagMap: Record<string, string[]> = {
        "DevSecOps": ["devsecops", "shift-left", "shift left", "trivy", "snyk", "sonarqube", "owasp"],
        "DevOps": ["devops", "ci/cd", "pipeline", "automation", "jenkins", "gitlab", "github actions"],
        "AWS": ["aws", "amazon web services", "s3", "ec2", "iam", "cloudwatch", "lambda", "ecs", "eks"],
        "Kubernetes": ["kubernetes", "k8s", "kubectl", "helm", "cluster", "pod", "ingress"],
        "Docker": ["docker", "container", "dockerfile", "containerd", "podman"],
        "Terraform": ["terraform", "iac", "infrastructure as code", "opentofu"],
        "Linux": ["linux", "bash", "shell", "ubuntu", "debian", "centos", "redhat"],
        "Azure": ["azure", "microsoft azure", "aks"],
        "GCP": ["gcp", "google cloud", "gke"],
        "CI/CD": ["ci/cd", "ci-cd", "pipeline", "continuous integration", "continuous deployment"],
        "Security": ["security", "cve", "vulnerability", "pentest", "iam", "compliance"],
        "Monitoring": ["monitoring", "prometheus", "grafana", "observability", "opentelemetry", "datadog"],
        "Python": ["python", "boto3", "flask", "fastapi"],
        "Ansible": ["ansible", "playbook"],
        "Networking": ["networking", "dns", "vpn", "tcp", "subnet", "vpc"],
      };

      const detectedTags: string[] = [];
      for (const [tag, keywords] of Object.entries(tagMap)) {
        if (keywords.some((k) => textToAnalyze.includes(k))) {
          detectedTags.push(tag);
        }
      }
      if (platform && !detectedTags.includes(platform) && detectedTags.length < 5) {
        detectedTags.unshift(platform);
      }

      // Detect Difficulty for labs
      let difficulty = "Hands-on";
      if (textToAnalyze.includes("advanced") || textToAnalyze.includes("expert") || textToAnalyze.includes("hard")) {
        difficulty = "Advanced";
      } else if (textToAnalyze.includes("intermediate") || textToAnalyze.includes("medium")) {
        difficulty = "Intermediate";
      } else if (textToAnalyze.includes("beginner") || textToAnalyze.includes("fundamentals") || textToAnalyze.includes("intro") || textToAnalyze.includes("easy")) {
        difficulty = "Beginner";
      }

      // Detect Duration for labs
      let duration = "Self-paced";
      const durMatch = textToAnalyze.match(/(\d+)\s*(?:hours?|hrs?|mins?|minutes?)/i);
      if (durMatch) {
        duration = durMatch[0];
      }

      // Favicon fallback
      const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${hostname || domain}&sz=128`;

      // Absolute URL fix for relative image path
      if (image && !image.startsWith("http")) {
        try {
          image = new URL(image, finalUrl).href;
        } catch (e) {}
      }

      const scrapedResult = {
        title,
        description,
        thumbnail: image || "",
        favicon,
        platform,
        domain,
        author: author || "",
        tags: detectedTags.slice(0, 6),
        difficulty,
        duration,
        canonicalUrl: finalUrl,
      };

      setCached(cacheKey, scrapedResult);

      return res.json({
        success: true,
        data: scrapedResult,
      });
    } catch (err: any) {
      console.error("Scrape meta fetch error:", err);
      return res.status(500).json({ error: err?.message || "Failed to scrape metadata" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.use("*", async (req, res, next) => {
      try {
        const fs = await import("fs/promises");
        let template = await fs.readFile(path.join(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
