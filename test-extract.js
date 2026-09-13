function extractTopicFromLinkedInUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes('/posts/')) {
       const parts = parsed.pathname.split('/').filter(Boolean);
       const postPart = parts[parts.length - 1];
       if (postPart.includes('_')) {
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
console.log(extractTopicFromLinkedInUrl("https://www.linkedin.com/posts/someuser_this-is-a-cool-topic-about-aws-activity-7123456789-abcd"));
console.log(extractTopicFromLinkedInUrl("https://www.linkedin.com/posts/username_some-long-slug-text-activity-12345-abcd"));
