const classifyUrl = (u) => {
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
  if (l.includes("twitter.com") || l.includes("x.com")) return "tw";
  if (l.includes("medium.com") || l.includes("dev.to") || l.includes("hashnode.com") || l.includes("hashnode.dev") || l.includes("substack.com") || l.includes("ghost.io")) return "blog";
  if (l.includes("mailto:")) return "email";
  return null;
}
console.log(classifyUrl("https://www.instagram.com/reel/DBc1aE1S5lB/?igsh=cTl4OTMwYXk0NTR2"));
