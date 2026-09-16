const fs = require('fs');
let content = fs.readFileSync('src/utils.ts', 'utf-8');

content = content.replace(
  /export function classifyUrl\(u: string\): "yt" \| "ys" \| "ypl" \| "li" \| "lp" \| "tw" \| "git" \| "blog" \| "email" \| "ig" \| "igp" \| "th" \| null \{/,
  'export function classifyUrl(u: string): "yt" | "ys" | "ypl" | "li" | "lp" | "tw" | "git" | "blog" | "email" | "ig" | "igp" | "th" | "web" | "lab" | null {'
);

// Add logic for labs and default to web
content = content.replace(
  /  if \(l\.startsWith\("mailto:"\)\) return "email";\n  return null;\n\}/,
  `  if (l.startsWith("mailto:")) return "email";
  if (l.includes("udemy.com") || l.includes("coursera.org") || l.includes("pluralsight.com") || l.includes("kodekloud.com") || l.includes("acloudguru.com")) return "lab";
  if (u.startsWith("http")) return "web";
  return null;
}`
);

fs.writeFileSync('src/utils.ts', content);
console.log('utils.ts patched.');
