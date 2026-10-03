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

      const finalUrl = response.url || targetUrl;
      const shortcodeMatch = html.match(/shortcode=([a-zA-Z0-9_-]+)/i)
        || (ogUrl || "").match(/\/(?:t|post)\/([a-zA-Z0-9_-]+)/i)
        || finalUrl.match(/\/(?:t|post)\/([a-zA-Z0-9_-]+)/i)
        || targetUrl.match(/\/(?:t|post)\/([a-zA-Z0-9_-]+)/i);
      const shortcode = shortcodeMatch ? shortcodeMatch[1] : "";

      const authorMatch = (ogUrl || finalUrl).match(/@([a-zA-Z0-9_.-]+)/)
        || title.match(/@([a-zA-Z0-9_.-]+)/);
      const author = authorMatch ? `@${authorMatch[1]}` : (title.includes("on Threads") ? title.replace(/\s+on Threads.*/i, "") : "Threads User");

      const media: Array<{ url: string; type: "image" | "video"; alt?: string; thumbnail?: string }> = [];
      const images: string[] = [];

      const cleanImage = image ? image.replace(/&amp;/g, "&") : "";

      // Extract all carousel photos from Threads post HTML so multiple slides are scrollable
      const imgMatches = html.match(/<img[\s\S]*?>/gi) || [];
      for (const m of imgMatches) {
        const isProfile = m.includes("t51.82787-19") || m.includes("sizes=\"36px\"") || m.includes("width=\"36\"") || m.includes("profile");
        if (!isProfile) {
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
              alt: description ? `${description.slice(0, 80)} (${images.length})` : `${title} (${images.length})`,
            });
          }
        }
      }

      // If no carousel photos found but og:image exists, use it
      if (images.length === 0 && cleanImage) {
        images.push(cleanImage);
        media.push({
          url: cleanImage,
          type: "image",
          alt: description ? description.slice(0, 100) : title,
        });
      }

      const ogVideo = getOg("og:video");
      const cleanVideo = ogVideo ? ogVideo.replace(/&amp;/g, "&") : "";
      if (cleanVideo) {
        media.unshift({
          url: cleanVideo,
          type: "video",
          thumbnail: cleanImage,
          alt: description ? description.slice(0, 100) : title,
        });
      }

      const thumbnail = cleanImage || (images.length > 0 ? images[0] : "");

      const resultData = {
        title: title || "Threads Post",
        description: description || "",
        thumbnail,
        images,
        media,
        videoUrl: cleanVideo || undefined,
        shortcode,
        author,
        canonicalUrl: ogUrl || finalUrl,
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

  // High-performance image proxy endpoint to bypass CORS / Referrer restrictions safely
  app.get("/api/image-proxy", async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl || (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://"))) {
      return res.status(400).send("Invalid URL parameter");
    }

    try {
      const upstream = await fetch(rawUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
      });

      if (!upstream.ok) {
        return res.status(upstream.status).send("Upstream image fetch failed");
      }

      const contentType = upstream.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const arrayBuffer = await upstream.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error("Image proxy error:", err.message);
      return res.status(500).send("Proxy error: " + err.message);
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

  // High-quality SVG cover generator for playlists if thumbnail is missing
  function generatePlaylistSvgDataUri(title: string, author?: string, count?: string | number) {
    const safeTitle = (title || "YouTube Playlist").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 48);
    const safeAuthor = (author || "Curated Series").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 36);
    const countStr = count ? `${count} Videos` : "Full Series";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#180B24"/>
          <stop offset="50%" stop-color="#0F051D"/>
          <stop offset="100%" stop-color="#05010B"/>
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="50%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bg)"/>
      <rect x="0" y="0" width="800" height="4" fill="url(#glow)"/>
      <rect x="520" y="100" width="220" height="250" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" transform="rotate(8 630 225)"/>
      <rect x="500" y="100" width="220" height="250" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" transform="rotate(4 610 225)"/>
      <rect x="480" y="100" width="220" height="250" rx="16" fill="#1C1028" stroke="rgba(239,68,68,0.3)"/>
      <circle cx="590" cy="225" r="48" fill="#EF4444" opacity="0.15"/>
      <polygon points="582,207 608,225 582,243" fill="#EF4444"/>
      <g transform="translate(60, 110)">
        <rect x="0" y="0" width="144" height="28" rx="14" fill="#EF4444" opacity="0.2"/>
        <rect x="0" y="0" width="144" height="28" rx="14" fill="none" stroke="#EF4444" stroke-opacity="0.4"/>
        <text x="72" y="18" fill="#FCA5A5" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">YOUTUBE PLAYLIST</text>
        <text x="0" y="70" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700">${safeTitle}</text>
        <text x="0" y="115" fill="#A1A1AA" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500">${safeAuthor}</text>
        <rect x="0" y="150" width="110" height="28" rx="6" fill="rgba(255,255,255,0.08)"/>
        <text x="55" y="168" fill="#E4E4E7" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" text-anchor="middle">▶ ${countStr}</text>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Dedicated YouTube & YouTube Playlist metadata endpoint
  app.get("/api/youtube-meta", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      const forceRefresh = req.query.force === "true";
      if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
      }

      const cacheKey = `yt_${targetUrl}`;
      if (!forceRefresh) {
        const cached = getCached(cacheKey);
        if (cached && cached.thumbnail && !cached.thumbnail.includes("placeholder")) {
          return res.json({ success: true, data: cached });
        }
      }

      let parsedPid = "";
      try {
        const u = new URL(targetUrl);
        parsedPid = u.searchParams.get("list") || "";
      } catch (e) {
        const m = targetUrl.match(/[?&]list=([^&]+)/i);
        if (m) parsedPid = m[1];
      }

      let parsedVid = "";
      try {
        const u = new URL(targetUrl);
        if (u.hostname === "youtu.be") parsedVid = u.pathname.slice(1).split("?")[0] || "";
        else if (u.pathname.startsWith("/shorts/")) parsedVid = u.pathname.split("/")[2] || "";
        else parsedVid = u.searchParams.get("v") || "";
      } catch (e) {
        const m = targetUrl.match(/(?:v=|\/shorts\/|youtu\.be\/)([^?&]+)/i);
        if (m) parsedVid = m[1];
      }

      let title = parsedPid ? "YouTube Playlist" : "YouTube Video";
      let author = "";
      let thumbnail = "";
      let videoCount: string | number = "";
      let videoList: string[] = [];

      // If URL itself includes videoId (e.g. watch?v=...&list=...), we have the video thumbnail immediately
      if (parsedVid) {
        thumbnail = `https://img.youtube.com/vi/${parsedVid}/hqdefault.jpg`;
      }

      // If this is a Playlist (has list= param)
      if (parsedPid) {
        try {
          const playlistPageUrl = `https://www.youtube.com/playlist?list=${parsedPid}`;
          const pageRes = await fetch(playlistPageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9",
              "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+478; SOCS=CAESEwgDEgk0ODEzNzk5NDIaAmVuIAEaBgiA_LyaBg;",
            },
          });

          if (pageRes.ok) {
            const html = await pageRes.text();

            // 1. Title
            const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1]
              || html.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i)?.[1]
              || html.match(/<title>([^<]+)<\/title>/i)?.[1];
            if (ogTitle) {
              const clean = ogTitle.replace(/\s*-\s*YouTube$/i, "").trim();
              if (clean && clean !== "undefined") {
                title = clean;
              }
            }

            // 2. Channel Author
            const authorMatch = html.match(/"ownerText":\{"runs":\[\{"text":"([^"]+)"/)?.[1]
              || html.match(/"channelTitle":"([^"]+)"/)?.[1]
              || html.match(/"url":"\/@([^"?/]+)"/)?.[1]
              || html.match(/<link\s+itemprop="name"\s+content="([^"]+)"/)?.[1]
              || "";
            if (authorMatch && authorMatch !== "undefined") {
              author = authorMatch.trim();
            }

            // 3. Extract Video IDs
            const vidMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
            const uniqueVids = [...new Set(vidMatches)];
            if (uniqueVids.length > 0) {
              videoList = uniqueVids.slice(0, 30);
              const firstVid = uniqueVids[0];
              if (!parsedVid) {
                parsedVid = firstVid;
              }
              // The first video thumbnail is the definitive thumbnail of the playlist!
              thumbnail = `https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`;
            }

            // 4. Video count
            const countMatch = html.match(/"numVideosText":\{"runs":\[\{"text":"([^"]+)"/)?.[1]
              || html.match(/"stats":\[\{"runs":\[\{"text":"([^"]+)"/)?.[1];
            if (countMatch) {
              videoCount = countMatch.replace(/[^0-9]/g, "") || countMatch;
            } else if (uniqueVids.length > 0) {
              videoCount = uniqueVids.length;
            }

            // 5. Fallback og:image if video ID thumbnail wasn't found
            if (!thumbnail) {
              const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
              if (ogImg && !ogImg.includes("undefined")) {
                thumbnail = ogImg.replace(/&amp;/g, "&");
              }
            }
          }
        } catch (scrapeErr) {
          console.warn("YouTube playlist scrape error:", scrapeErr);
        }
      } else {
        // Single video oEmbed
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;
          const oembedRes = await fetch(oembedUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            },
          });
          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            if (oembedData.title) title = oembedData.title;
            if (oembedData.author_name) author = oembedData.author_name;
            if (oembedData.thumbnail_url) thumbnail = oembedData.thumbnail_url;
          }
        } catch (oembedErr) {
          console.warn("YouTube oEmbed fetch error:", oembedErr);
        }
      }

      // If thumbnail is still missing or a placeholder, generate our SVG cover
      if (!thumbnail || thumbnail.includes("placeholder")) {
        if (parsedVid) {
          thumbnail = `https://img.youtube.com/vi/${parsedVid}/hqdefault.jpg`;
        } else {
          thumbnail = generatePlaylistSvgDataUri(title, author, videoCount);
        }
      }

      const result = {
        title,
        author,
        thumbnail,
        pid: parsedPid || undefined,
        vid: parsedVid || undefined,
        count: videoCount || (videoList.length ? videoList.length : undefined),
        videoList: videoList.length ? videoList : undefined,
      };

      setCached(cacheKey, result);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      console.error("YouTube meta endpoint error:", err);
      return res.status(500).json({ error: err?.message || "Failed to resolve YouTube metadata" });
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
