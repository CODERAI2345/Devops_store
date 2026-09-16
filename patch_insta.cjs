const fs = require('fs');
let content = fs.readFileSync('src/components/InstagramModal.tsx', 'utf-8');
content = content.replace(
  /src=\{\`https\:\/\/www\.instagram\.com\/p\/\$\{item\.shortcode\}\/embed\`\}/,
  'src={`https://www.instagram.com/p/${item.shortcode}/embed/captioned`}'
);
fs.writeFileSync('src/components/InstagramModal.tsx', content);
console.log('Fixed embed url');
