import fs from 'fs';

let code = fs.readFileSync('src/components/Cards.tsx', 'utf8');
code = code.replace(
  'const category = getCategoryStyle(item.heading);',
  'const extractedTopic = extractTopicFromLinkedInUrl(item.url);\n  const category = getCategoryStyle(item.heading || extractedTopic || "LinkedIn Post");'
);

fs.writeFileSync('src/components/Cards.tsx', code);
