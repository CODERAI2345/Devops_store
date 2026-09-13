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

export function classifyUrl(u: string): "yt" | "ys" | "ypl" | "li" | "lp" | "tw" | "git" | "blog" | "email" | "ig" | null {
  if (u.toLowerCase().includes("instagram.com") || u.toLowerCase().includes("instagr.am")) return "ig";
  const l = u.toLowerCase();
  if (l.includes("github.com") && l.split("/").length >= 4) return "git";
  if (l.includes("youtube.com/playlist")) return "ypl";
  if (l.includes("youtube.com/shorts/")) return "ys";
  if (l.includes("youtube.com/watch") || l.includes("youtu.be/")) return "yt";
  if (l.includes("linkedin.com/in/")) return "li";
  if (
    l.includes("linkedin.com/posts/") ||
    l.includes("linkedin.com/feed/update") ||
    l.includes("linkedin.com/pulse/")
  )
    return "lp";
  if (l.includes("twitter.com") || l.includes("x.com") || l.includes("t.co")) return "tw";
  if (
    l.includes("medium.com") ||
    l.includes("hashnode.dev") ||
    l.includes("dev.to") ||
    l.includes("substack.com") ||
    l.includes("blog.") ||
    l.includes("article")
  )
    return "blog";
  if (l.startsWith("mailto:")) return "email";
  return null;
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
    const u = new URL(url);
    if (!u.hostname.includes('instagram.com') && !u.hostname.includes('instagr.am')) return null;
    const m = u.pathname.match(/\/(?:p|reel|reels|tv)\/([^\/?#]+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}
