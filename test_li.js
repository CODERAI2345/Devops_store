const urls = [
  "https://www.linkedin.com/posts/username_some-text-activity-7123456789012345678-abcd",
  "https://www.linkedin.com/feed/update/urn:li:activity:7215984024316104705/",
  "https://www.linkedin.com/pulse/some-article-1234567890",
  "https://www.linkedin.com/posts/person-name-1234567890-abcd"
];

function getLinkedInEmbedUrl(url) {
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
        return "https://www.linkedin.com/embed/feed/update/urn:li:share:" + digitMatch[1];
    }
  } catch (e) {}
  return null;
}

urls.forEach(u => console.log(u, '=>', getLinkedInEmbedUrl(u)));
