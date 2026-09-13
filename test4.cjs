const classifyUrl = (u) => {
  if (u.toLowerCase().includes("instagram.com") || u.toLowerCase().includes("instagr.am")) return "ig";
  return null;
}
const extractInstagramShortcode = (url) => {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('instagram.com') && !u.hostname.includes('instagr.am')) return null;
    const m = u.pathname.match(/\/(?:p|reel|reels|tv)\/([^\/?#]+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}
const ytId = () => null;
const ytPlaylistId = () => null;

async function handleAddLink(addInput) {
    let url = addInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
      url = "https://" + url;
    }
    const t = classifyUrl(url) || "ig";
    try {
      let meta = {
        url,
        title: "Link",
        author: "",
      };
      if (t === "ig") {
        const shortcode = extractInstagramShortcode(url) || "";
        meta = {
          ...meta,
          title: "Instagram Post",
          author: "Instagram",
          description: "Embedded Instagram Content",
          thumbnail: "",
          shortcode,
          tags: [],
        };
      }
      const id = Date.now() + Math.random();
      const date = "today";
      const item = {
        id,
        type: t,
        url: meta.url,
        date,
        ts: id,
        title: meta.title,
        author: meta.author,
        thumbnail: meta.thumbnail || "",
        description: meta.description || "",
        tags: meta.tags || [],
        starred: false,
        company: meta.company || "",
        location: meta.location || "",
        role: meta.role || "",
        platform: meta.platform || "",
        handle: meta.handle || "",
        heading: meta.heading || "",
      };
      if (t === "ig") item.shortcode = meta.shortcode || "";
      console.log("Successfully created item:", item);
    } catch(e) {
      console.error("Error creating item:", e);
    }
}
handleAddLink("https://www.instagram.com/reel/C3X9-4_x8aE/");
handleAddLink("instagram.com/p/123");
