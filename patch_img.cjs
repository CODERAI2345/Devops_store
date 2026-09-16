const fs = require('fs');
let content = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

// Replace <img ... > to add onError fallback if it doesn't have one
content = content.replace(/<img(?![^>]*onError=)([^>]*)>/g, `<img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }} $1>`);

fs.writeFileSync('src/components/Cards.tsx', content);
