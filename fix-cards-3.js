import fs from 'fs';

let code = fs.readFileSync('src/components/Cards.tsx', 'utf8');

code = code.replace(
  '{item.title && item.title !== "LinkedIn Post" ? item.title : "LinkedIn Post Collection"}',
  '{item.title && item.title !== "LinkedIn Post" ? item.title : (extractedTopic || "LinkedIn Post Collection")}'
);

fs.writeFileSync('src/components/Cards.tsx', code);
