const fs = require('fs');

const utilContent = `

export function extractInstagramShortcode(url: string) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('instagram.com') && !u.hostname.includes('instagr.am')) return null;
    const m = u.pathname.match(/\\/(?:p|reel|tv)\\/([^\\/?#]+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}
`;

fs.appendFileSync('src/utils.ts', utilContent);
