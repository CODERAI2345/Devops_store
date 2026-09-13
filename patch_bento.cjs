const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Bento grid cards hover
lp = lp.replace(
  /className="md:col-span-2 relative group rounded-2xl border border-orange-500\/30 bg-gradient-to-br from-\[#16110f\] to-\[#0a0808\] p-8 overflow-hidden hover:border-orange-500\/60 transition-colors"/g,
  'className="md:col-span-2 relative group rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#16110f] to-[#0a0808] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]"'
);

lp = lp.replace(
  /className="relative group rounded-2xl border border-white\/10 bg-\[#0d1117\] p-8 overflow-hidden hover:border-white\/30 transition-colors"/g,
  'className="relative group rounded-2xl border border-white/10 bg-[#0d1117] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]"'
);

lp = lp.replace(
  /className="relative group rounded-2xl border border-red-500\/20 bg-gradient-to-br from-\[#1a0f0f\] to-\[#0a0505\] p-8 overflow-hidden hover:border-red-500\/40 transition-colors"/g,
  'className="relative group rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#1a0f0f] to-[#0a0505] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]"'
);

lp = lp.replace(
  /className="relative group rounded-2xl border border-cyan-500\/20 bg-gradient-to-br from-\[#0f171a\] to-\[#05080a\] p-8 overflow-hidden hover:border-cyan-500\/40 transition-colors"/g,
  'className="relative group rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0f171a] to-[#05080a] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)]"'
);

lp = lp.replace(
  /className="relative group rounded-2xl border border-blue-500\/20 bg-gradient-to-br from-\[#0f141a\] to-\[#05080a\] p-8 overflow-hidden hover:border-blue-500\/40 transition-colors"/g,
  'className="relative group rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0f141a] to-[#05080a] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]"'
);

// Add stagger to Bento grid
lp = lp.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-6">/,
  '<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">'
);

// We have 5 cards in Bento Grid, wrap them in StaggerItem
lp = lp.replace(
  /\{(\/\* Main Feature: Career Emails \*\/)\}/,
  '<StaggerItem className="md:col-span-2">{$1}'
);
lp = lp.replace(
  /\{(\/\* Secondary: GitHub \*\/)\}/,
  '</StaggerItem>\n          <StaggerItem>{$1}'
);
lp = lp.replace(
  /\{(\/\* Tertiary: YouTube \*\/)\}/,
  '</StaggerItem>\n          <StaggerItem>{$1}'
);
lp = lp.replace(
  /\{(\/\* Tertiary: Technical Blogs \*\/)\}/,
  '</StaggerItem>\n          <StaggerItem>{$1}'
);
lp = lp.replace(
  /\{(\/\* Tertiary: LinkedIn \*\/)\}/,
  '</StaggerItem>\n          <StaggerItem>{$1}'
);

// close the last StaggerItem and StaggerContainer
lp = lp.replace(
  /<\/div>\s*<div className="mt-12 text-center">/,
  '          </StaggerItem>\n        </StaggerContainer>\n        \n        <div className="mt-12 text-center">'
);

// And we need to remove the "md:col-span-2" from the inner div of the main feature since it's on StaggerItem now.
lp = lp.replace(
  /<StaggerItem className="md:col-span-2">\{\/\* Main Feature: Career Emails \*\/\}\s*<div className="md:col-span-2 relative group/,
  '<StaggerItem className="md:col-span-2">{/* Main Feature: Career Emails */}\n          <div className="relative h-full group'
);

fs.writeFileSync('src/components/LandingPage.tsx', lp);
