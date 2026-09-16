const fs = require('fs');
let content = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

// Replace export function SomeCard( with export const SomeCard = React.memo(function SomeCard( ... )
content = content.replace(/export function ([A-Za-z]+Card)\((.*?)\) \{([\s\S]*?^\})/gm, 'export const $1 = React.memo(function $1($2) {$3});');

// Add loading="lazy" to all <img tags
content = content.replace(/<img(?![^>]*loading=)([^>]*)>/g, '<img loading="lazy"$1>');

// Optimize CSS effects in Cards: 
// The user says "replace heavy continuous backdrop-filter: blur() and complex box shadows with lightweight hardware-accelerated transforms (transform: translateY(-4px)) and subtle border transitions"
// Let's replace "backdrop-blur-md" and "backdrop-blur-sm" with nothing or just remove them from card classes?
// Usually, cards have a base class like "bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 ... shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-white/20"
// I will just use sed to modify some classes.

fs.writeFileSync('src/components/Cards.tsx', content);
