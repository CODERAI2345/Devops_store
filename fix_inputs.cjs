const fs = require('fs');

const replacements = [
  [/placeholder-white\/[0-9]+/g, "placeholder-slate-400"],
  [/bg-black\/50/g, "bg-slate-50"],
  [/bg-slate-900\/10/g, "bg-slate-50"],
  [/focus:bg-\[\#1A1A1A\]/g, "focus:bg-slate-100"],
  [/bg-white\/\[0\.03\]/g, "bg-slate-100"],
  [/focus:bg-white\/\[0\.05\]/g, "focus:bg-slate-200"],
  [/\btext-\[\#A1A1AA\]\b/g, "text-slate-500"],
  [/\bbg-\[\#27272A\]\/50\b/g, "bg-slate-200"],
  [/\btext-slate-300\b/g, "text-slate-600"],
  [/\bbg-\[\#121212\]\/80\b/g, "bg-white/80"],
  [/shadow-\[0_0_20px_rgba\(16,185,129,0\.2\)\]/g, "shadow-sm"],
  [/from-orange-500\/5/g, "from-orange-50"],
  [/to-purple-500\/5/g, "to-purple-50"],
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  
  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated inputs in ${filePath}`);
  }
}

const filesToProcess = [
  'src/App.tsx',
  'src/components/Cards.tsx',
  'src/components/LandingPage.tsx',
  'src/components/AnalyticsDashboard.tsx'
];

filesToProcess.forEach(processFile);
