export function ytId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be")
      return u.pathname.slice(1).split("?")[0] || null;
    if (u.pathname.startsWith("/shorts/"))
      return u.pathname.split("/")[2] || null;
    return u.searchParams.get("v") || null;
  } catch (e) {
    return null;
  }
}

export function ytPlaylistId(url: string) {
  try {
    const u = new URL(url);
    return u.searchParams.get("list") || null;
  } catch (e) {
    return null;
  }
}

export function parseSlug(url: string, type: "li" | "lp") {
  try {
    if (type === "lp") {
      const m = url.match(/linkedin\.com\/(?:posts|pulse)\/([^/?#]+)/i);
      if (m) return decodeURIComponent(m[1]);
    }
    if (type === "li") {
      const m = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
      if (m) return decodeURIComponent(m[1]);
    }
  } catch (e) {}
  return "";
}

export function isThreadsUrl(url: string): boolean {
  if (!url) return false;
  try {
    const raw = url.trim().toLowerCase();
    if (
      raw.includes("threads.net") ||
      raw.includes("threads.com") ||
      raw.includes("threads.page")
    ) {
      return true;
    }
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (parsed.hostname.includes("threads")) return true;
  } catch (e) {
    const l = url.toLowerCase();
    if (l.includes("threads.net") || l.includes("threads.com")) return true;
  }
  return false;
}

export function isInstagramUrl(url: string): boolean {
  if (!url) return false;
  try {
    const raw = url.trim().toLowerCase();
    if (raw.includes("instagram.com") || raw.includes("instagr.am")) return true;
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return parsed.hostname.includes("instagram") || parsed.hostname.includes("instagr.am");
  } catch (e) {
    const l = url.toLowerCase();
    return l.includes("instagram.com") || l.includes("instagr.am");
  }
}

export function isInstagramReelUrl(url: string): boolean {
  if (!isInstagramUrl(url)) return false;
  try {
    const raw = url.trim().toLowerCase();
    if (
      raw.includes("/reel/") ||
      raw.includes("/reels/") ||
      raw.includes("/share/reel/") ||
      raw.includes("/tv/") ||
      raw.includes("reel=true")
    ) {
      return true;
    }
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const pathname = parsed.pathname.toLowerCase();
    return (
      pathname.includes("/reel/") ||
      pathname.includes("/reels/") ||
      pathname.includes("/share/reel/") ||
      pathname.includes("/tv/")
    );
  } catch (e) {
    const l = url.toLowerCase();
    return (
      l.includes("/reel/") ||
      l.includes("/reels/") ||
      l.includes("/share/reel/") ||
      l.includes("/tv/")
    );
  }
}

export function classifyUrl(u: string): "yt" | "ys" | "ypl" | "li" | "lp" | "tw" | "git" | "blog" | "email" | "ig" | "igp" | "th" | "web" | "lab" | null {
  if (isThreadsUrl(u)) return "th";
  if (isInstagramUrl(u)) {
    // If it's explicitly a reel, reels, share/reel, or tv path, classify as 'ig' (Reel)
    if (isInstagramReelUrl(u)) {
      return "ig";
    }
    const l = u.toLowerCase();
    if (l.includes("/p/") || l.includes("/share/p/")) {
      return "igp";
    }
    return "ig";
  }
  const l = u.toLowerCase();
  if (l.includes("github.com") && l.split("/").length >= 4) return "git";
  if (l.includes("youtube.com/playlist") || (l.includes("youtube.com") && (l.includes("list=") || l.includes("&list=")))) return "ypl";
  if (l.includes("youtube.com/shorts/")) return "ys";
  if (l.includes("youtube.com/watch") || l.includes("youtu.be/")) return "yt";
  if (l.includes("linkedin.com/in/")) return "li";
  if (
    l.includes("linkedin.com/posts/") ||
    l.includes("linkedin.com/feed/update") ||
    l.includes("linkedin.com/pulse/")
  )
    return "lp";
  if (l.includes("twitter.com") || l.includes("x.com") || /(?:^|\/\/|\.)t\.co(?:\/|$)/.test(l)) return "tw";
  if (
    l.includes("medium.com") ||
    l.includes("hashnode.dev") ||
    l.includes("hashnode.com") ||
    l.includes("dev.to") ||
    l.includes("substack.com") ||
    l.includes("freedium") ||
    l.includes("plainenglish.io") ||
    l.includes("awstip.com") ||
    l.includes("stackademic.com") ||
    l.includes("devopscube.com") ||
    l.includes("techiescamp.com") ||
    l.includes("hackernoon.com") ||
    l.includes("freecodecamp.org") ||
    l.includes("towardsdatascience.com") ||
    l.includes("infoq.com") ||
    l.includes("dzone.com") ||
    l.includes("blogspot.com") ||
    l.includes("wordpress.com") ||
    l.includes("ghost.io") ||
    l.includes("mirror.xyz") ||
    l.includes("beehiiv.com") ||
    l.includes("betterprogramming.pub") ||
    l.includes("blog.") ||
    l.includes("blogs.") ||
    l.includes("/blog/") ||
    l.includes("/blogs/") ||
    l.includes("/article") ||
    l.includes("/articles") ||
    l.includes("/newsletter/") ||
    l.includes("newsletter.") ||
    l.includes("/story/") ||
    l.includes("/stories/") ||
    (/\/(?:post|p)\/[a-z0-9-_]+/i.test(l) && !l.includes("facebook.com") && !l.includes("linkedin.com") && !l.includes("instagram.com") && !l.includes("threads.net"))
  )
    return "blog";
  if (l.startsWith("mailto:")) return "email";
  if (
    l.includes("udemy.com") ||
    l.includes("coursera.org") ||
    l.includes("pluralsight.com") ||
    l.includes("kodekloud.com") ||
    l.includes("kode.wiki") ||
    l.includes("killercoda.com") ||
    l.includes("killer.sh") ||
    l.includes("sadservers.com") ||
    l.includes("tryhackme.com") ||
    l.includes("hackthebox.com") ||
    l.includes("acloudguru.com") ||
    l.includes("instruqt.com") ||
    l.includes("workshops.aws") ||
    l.includes("skillbuilder.aws") ||
    l.includes("wellarchitectedlabs.com") ||
    l.includes("cloudskillsboost.google") ||
    l.includes("qwiklabs.com") ||
    l.includes("play-with-docker.com") ||
    l.includes("play-with-k8s.com") ||
    l.includes("/courses/") ||
    l.includes("/labs/") ||
    l.includes("/handson/")
  )
    return "lab";
  if (u.startsWith("http")) return "web";
  return null;
}

export function getLabDifficultyBadge(difficulty?: string) {
  const d = (difficulty || "Hands-on").toLowerCase();
  if (d.includes("beginner") || d.includes("intro") || d.includes("easy")) {
    return { label: "Beginner", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  }
  if (d.includes("intermediate") || d.includes("medium")) {
    return { label: "Intermediate", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  }
  if (d.includes("advanced") || d.includes("expert") || d.includes("hard")) {
    return { label: "Advanced", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  }
  return { label: "Hands-on", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
}

export function extractTwitterUsername(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("twitter.com") || u.hostname.includes("x.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length > 0 && parts[0] !== "home" && parts[0] !== "search" && parts[0] !== "notifications") {
        return "@" + parts[0];
      }
    }
  } catch (e) {}
  return "";
}

export function shortenUrl(u: string, max: number) {
  try {
    u = u.replace(/^https?:\/\/(www\.)?/, "");
  } catch (e) {}
  return u.length > max ? u.slice(0, max) + "..." : u;
}

export function extractEmailDetails(email: string) {
  if (!email || !email.includes('@')) return { company: "", logo: "" };
  const domain = email.split('@')[1];
  if (!domain) return { company: "", logo: "" };
  
  const parts = domain.split('.');
  if (parts.length < 2) return { company: "", logo: "" };
  
  const commonDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'aol', 'protonmail', 'live'];
  const name = parts[0].toLowerCase();
  
  if (commonDomains.includes(name)) {
    return { company: "", logo: "" }; // Personal email, leave blank for manual entry
  }
  
  const company = name.charAt(0).toUpperCase() + name.slice(1);
  
  return { company, logo: "" };
}

export function getLinkedInEmbedUrl(url: string) {
  try {
    const urnMatch = url.match(/urn:li:([a-zA-Z]+):([0-9]+)/);
    if (urnMatch) {
      return "https://www.linkedin.com/embed/feed/update/urn:li:" + urnMatch[1] + ":" + urnMatch[2];
    }
    const typeMatch = url.match(/-(ugcPost|activity|share)-([0-9]{18,20})/);
    if (typeMatch) {
      return "https://www.linkedin.com/embed/feed/update/urn:li:" + typeMatch[1] + ":" + typeMatch[2];
    }
    const digitMatch = url.match(/-([0-9]{18,20})/);
    if (digitMatch) {
        // Fallback to activity which is the most common type for these URLs
        return "https://www.linkedin.com/embed/feed/update/urn:li:activity:" + digitMatch[1];
    }
  } catch (e) {}
  return null;
}

export function guessCategoryFromUrl(url: string) {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('aws') || lowerUrl.includes('amazon-web-services')) return "AWS";
    if (lowerUrl.includes('azure')) return "Azure";
    if (lowerUrl.includes('devops')) return "DevOps";
    if (lowerUrl.includes('terraform')) return "Terraform";
    if (lowerUrl.includes('linux')) return "Linux";
    if (lowerUrl.includes('interview')) return "Interview";
    if (lowerUrl.includes('career') || lowerUrl.includes('hiring') || lowerUrl.includes('jobs')) return "Career";
    if (lowerUrl.includes('ai-') || lowerUrl.includes('-ai-') || lowerUrl.includes('artificial-intelligence') || lowerUrl.includes('openai') || lowerUrl.includes('chatgpt') || lowerUrl.includes('machine-learning') || lowerUrl.includes('genai')) return "AI";
    if (lowerUrl.includes('network')) return "Networking";
    
    return ""; 
}

export function extractLinkedInAuthor(url: string) {
    try {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('/posts/')) {
            const parts = url.split('/posts/');
            if (parts.length > 1) {
                const afterPosts = parts[1];
                const authorPart = afterPosts.split(/[-_]/)[0];
                if (authorPart) {
                    // Capitalize the author name
                    return authorPart.charAt(0).toUpperCase() + authorPart.slice(1);
                }
            }
        }
        if (lowerUrl.includes('/in/')) {
            const parts = url.split('/in/');
            if (parts.length > 1) {
                const afterIn = parts[1].split(/[/?]/)[0];
                return afterIn.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        }
    } catch (e) {}
    return "";
}


export function extractTopicFromLinkedInUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes('/posts/')) {
       const parts = parsed.pathname.split('/').filter(Boolean);
       const postPart = parts[parts.length - 1];
       if (postPart && postPart.includes('_')) {
           const slugPart = postPart.split('_')[1];
           if (slugPart) {
               let topic = slugPart.replace(/-activity.*$/, '');
               topic = topic.replace(/-/g, ' ');
               if (topic.trim().length > 0) {
                 return topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
               }
           }
       }
    }
  } catch(e) {}
  return "";
}

export function getTwitterEmbedUrl(url: string) {
  try {
    const match = url.match(/\/status\/(\d+)/);
    if (match && match[1]) {
      return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}&theme=dark`;
    }
  } catch (e) {}
  return null;
}



export function extractInstagramShortcode(url: string) {
  try {
    const raw = url.trim();
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (!u.hostname.includes('instagram.com') && !u.hostname.includes('instagr.am')) return null;
    const m = u.pathname.match(/(?:\/p\/|\/reel\/|\/reels\/|\/tv\/|\/share\/reel\/|\/share\/p\/)([^\/?#]+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}


export function extractThreadsShortcode(url: string) {
  try {
    const raw = url.trim();
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (!u.hostname.includes('threads.net') && !u.hostname.includes('threads.com') && !u.hostname.includes('threads')) {
      return null;
    }
    // Match /post/SHORTCODE or /t/SHORTCODE
    const m = u.pathname.match(/\/(?:t|post)\/([^\/?#]+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}

export function extractThreadsAuthor(url: string): string {
  try {
    const m = url.match(/@([a-zA-Z0-9_.-]+)/);
    if (m && m[1]) return `@${m[1]}`;
  } catch (e) {}
  return "";
}
