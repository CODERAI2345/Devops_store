const fs = require('fs');

let content = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

// A premium violet glowing edge class
const violetEdgeClass = 'group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/50 hover:shadow-[inset_0_1px_0_0_rgba(167,139,250,0.6),0_8px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col';

// Replace all standard flex flex-col group cards
content = content.replace(/className="group relative overflow-hidden rounded-2xl[^"]*flex flex-col"/g, `className="${violetEdgeClass}"`);
content = content.replace(/className="group relative overflow-hidden rounded-2xl[^"]*flex flex-col p-5"/g, `className="${violetEdgeClass} p-5"`);

// Replace the fixed height 500px cards (LI, IG, TH, TW)
content = content.replace(/className="group h-\[500px\] flex flex-col relative overflow-hidden rounded-xl[^"]*"/g, `className="${violetEdgeClass} h-[500px]"`);

// Replace Github card (h-full)
content = content.replace(/className="group h-full relative overflow-hidden rounded-xl[^"]*"/g, `className="${violetEdgeClass} h-full"`);

fs.writeFileSync('src/components/Cards.tsx', content);
console.log('Violet edge applied to all cards.');
