import fs from 'fs';

let code = fs.readFileSync('src/utils.ts', 'utf8');

const newFunc = `
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
`;

code = code + '\n' + newFunc;

fs.writeFileSync('src/utils.ts', code);
