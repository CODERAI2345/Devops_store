const fs = require('fs');
const path = require('path');

const replacements = [
  // Body/Global
  [/background-color:\s*#080b1d;/g, "background-color: #f8fafc;"],
  [/color:\s*#ffffff;/g, "color: #0f172a;"],
  [/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, "rgba(0, 0, 0, 0.1)"],
  [/rgba\(255,\s*255,\s*255,\s*0\.2\)/g, "rgba(0, 0, 0, 0.2)"],

  // Text colors
  [/\btext-white\b/g, "text-slate-900"],
  [/\btext-white\/60\b/g, "text-slate-500"],
  [/\btext-white\/50\b/g, "text-slate-500"],
  [/\btext-white\/40\b/g, "text-slate-400"],
  [/\btext-white\/30\b/g, "text-slate-400"],
  [/\btext-\[\#EDEDED\]\b/g, "text-slate-900"],
  [/\btext-\[\#A1A1AA\]\b/g, "text-slate-500"],
  [/\btext-slate-300\b/g, "text-slate-600"],
  [/\btext-slate-400\b/g, "text-slate-500"],
  [/\btext-\[\#848d97\]\b/g, "text-slate-500"],
  [/\btext-\[\#e3e3e3\]\b/g, "text-slate-800"],
  [/\btext-\[\#999999\]\b/g, "text-slate-500"],

  // Backgrounds
  [/\bbg-\[\#121212\]\b/g, "bg-white"],
  [/\bbg-\[\#080b1d\]\b/g, "bg-slate-50"],
  [/\bbg-\[\#090d20\]\b/g, "bg-white"],
  [/\bbg-\[\#27272A\]\b/g, "bg-slate-100"],
  [/\bbg-\[\#18181B\]\b/g, "bg-slate-50"],
  [/\bbg-white\/10\b/g, "bg-slate-100"],
  [/\bbg-white\/5\b/g, "bg-slate-50"],
  [/\bbg-white\/\[0\.03\]\b/g, "bg-white"],
  [/\bbg-white\/\[0\.02\]\b/g, "bg-slate-50"],
  [/\bbg-black\/40\b/g, "bg-slate-900/10"],
  [/\bbg-black\/60\b/g, "bg-slate-900/10"],
  [/\bbg-\[\#1d2226\]\b/g, "bg-white"],
  [/\bbg-\[\#101010\]\b/g, "bg-white"],
  [/\bbg-\[\#0d1117\]\b/g, "bg-white"],

  // Borders
  [/\bborder-white\/10\b/g, "border-slate-200"],
  [/\bborder-white\/5\b/g, "border-slate-100"],
  [/\bborder-white\/\[0\.08\]\b/g, "border-slate-200"],
  [/\bborder-white\/\[0\.05\]\b/g, "border-slate-100"],
  [/\bborder-\[\#27272A\]\b/g, "border-slate-200"],
  [/\bborder-\[\#30363d\]\b/g, "border-slate-200"],
  [/\bborder-\[\#38434f\]\b/g, "border-slate-200"],
  [/\bborder-\[\#2a2a2a\]\b/g, "border-slate-200"],
  [/\bborder-\[\#4b5563\]\b/g, "border-slate-300"],
  
  // Hovers
  [/\bhover:bg-white\/10\b/g, "hover:bg-slate-100"],
  [/\bhover:bg-white\/5\b/g, "hover:bg-slate-50"],
  [/\bhover:bg-white\/\[0\.05\]\b/g, "hover:bg-slate-50"],
  [/\bhover:bg-white\/\[0\.04\]\b/g, "hover:bg-slate-50"],
  [/\bhover:border-white\/\[0\.15\]\b/g, "hover:border-slate-300"],
  [/\bhover:border-white\/\[0\.1\]\b/g, "hover:border-slate-300"],
  [/\bhover:border-\[\#8b949e\]\b/g, "hover:border-slate-400"],
  [/\bhover:border-\[\#4b5563\]\b/g, "hover:border-slate-300"],
  [/\bhover:border-\[\#404040\]\b/g, "hover:border-slate-300"],

  // Accents / Brand
  [/\btext-orange-400\b/g, "text-orange-600"],
  [/\bbg-orange-500\/10\b/g, "bg-orange-100"],
  [/\bbg-orange-500\/20\b/g, "bg-orange-100"],
  [/\bshadow-\[0_0_30px_rgba\(255,255,255,0\.05\)\]\b/g, "shadow-[0_4px_20px_rgba(0,0,0,0.05)]"],
  [/\bshadow-\[0_0_20px_rgba\(249,115,22,0\.4\)\]\b/g, "shadow-[0_0_20px_rgba(249,115,22,0.2)]"],

  // Gradients
  [/\bfrom-indigo-950\b/g, "from-indigo-50"],
  [/\bvia-purple-950\b/g, "via-purple-50"],
  [/\bto-orange-900\/80\b/g, "to-orange-50"],
  [/\bfrom-black\/80\b/g, "from-slate-900/40"],
  
  // Inputs & Modals specific
  [/\bbg-black\/40 backdrop-blur-md\b/g, "bg-white/80 backdrop-blur-md"],
  [/\bbg-black\/80 backdrop-blur-sm\b/g, "bg-slate-900/20 backdrop-blur-sm"]
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
    console.log(`Updated ${filePath}`);
  }
}

const filesToProcess = [
  'src/index.css',
  'src/App.tsx',
  'src/components/LandingPage.tsx',
  'src/components/Cards.tsx',
  'src/components/Modal.tsx',
  'src/components/ThreadsModal.tsx',
  'src/components/InstagramModal.tsx',
  'src/components/AnalyticsDashboard.tsx',
  'src/components/AdminExport.tsx',
];

filesToProcess.forEach(processFile);
