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
let url = "instagram.com/p/123";
if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
  url = "https://" + url;
}
console.log(classifyUrl(url), extractInstagramShortcode(url));
url = "https://www.instagram.com/reels/C3X9-4_x8aE/";
console.log(classifyUrl(url), extractInstagramShortcode(url));
url = "https://www.instagram.com/reel/C3X9-4_x8aE/";
console.log(classifyUrl(url), extractInstagramShortcode(url));
url = "https://instagram.com/p/C3X9-4_x8aE/";
console.log(classifyUrl(url), extractInstagramShortcode(url));
