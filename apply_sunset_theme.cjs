const fs = require('fs');

const replacements = [
  // index.css Body
  [/background-color:\s*#f8fafc;/g, "background: linear-gradient(135deg, #eef2ff 0%, #fff1f2 50%, #fae8ff 100%);\n  background-attachment: fixed;"],
  [/color:\s*#0f172a;/g, "color: #1e1b4b;"],
  
  // index.css custom scrollbar
  [/rgba\(0, 0, 0, 0\.1\)/g, "rgba(49, 46, 129, 0.1)"], // indigo-900/10
  [/rgba\(0, 0, 0, 0\.2\)/g, "rgba(49, 46, 129, 0.2)"],

  // index.css electric pulse animation (orange to fuchsia/violet)
  [/#f97316/g, "#d946ef"], // fuchsia-500

  // Colors: Text
  [/\btext-slate-900\b/g, "text-indigo-950"],
  [/\btext-slate-800\b/g, "text-indigo-900"],
  [/\btext-slate-600\b/g, "text-indigo-900/80"],
  [/\btext-slate-500\b/g, "text-indigo-900/60"],
  [/\btext-slate-400\b/g, "text-indigo-900/40"],
  [/\bplaceholder-slate-400\b/g, "placeholder-indigo-900/30"],
  
  // Colors: Backgrounds
  [/\bbg-white\b/g, "bg-white/70"], // Make solid white glassy
  [/\bbg-slate-50\b/g, "bg-white/40"],
  [/\bbg-slate-100\b/g, "bg-white/60"],
  [/\bbg-slate-200\b/g, "bg-indigo-50/50"],
  [/\bbg-slate-900\/10\b/g, "bg-indigo-900/5"],
  
  // Colors: Borders
  [/\bborder-slate-100\b/g, "border-white/50"],
  [/\bborder-slate-200\b/g, "border-white/40"],
  [/\bborder-slate-300\b/g, "border-indigo-100/50"],
  
  // Hovers
  [/\bhover:bg-slate-50\b/g, "hover:bg-white/60"],
  [/\bhover:bg-slate-100\b/g, "hover:bg-white/80"],
  [/\bhover:border-slate-300\b/g, "hover:border-indigo-200/50"],
  [/\bhover:border-slate-400\b/g, "hover:border-indigo-300/50"],

  // Shadows
  [/\bshadow-\[0_4px_20px_rgba\(0,0,0,0\.05\)\]\b/g, "shadow-[0_8px_30px_rgba(49,46,129,0.08)]"],

  // Modals & Backdrops
  [/\bbg-white\/80 backdrop-blur-md\b/g, "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-900/10"],
  [/\bbg-slate-900\/20 backdrop-blur-sm\b/g, "bg-indigo-950/20 backdrop-blur-sm"],

  // Accents / Brand (Orange -> Fuchsia/Violet)
  [/\btext-orange-600\b/g, "text-fuchsia-600"],
  [/\btext-orange-500\b/g, "text-violet-600"],
  [/\btext-orange-400\b/g, "text-violet-500"],
  
  [/\bbg-orange-100\b/g, "bg-fuchsia-100/50"],
  [/\bbg-orange-400\b/g, "bg-violet-500"],
  [/\bbg-orange-500\b/g, "bg-violet-600"],
  [/\bhover:bg-orange-400\b/g, "hover:bg-violet-500"],
  [/\bhover:bg-orange-500\b/g, "hover:bg-violet-600"],
  [/\bhover:text-orange-400\b/g, "hover:text-violet-600"],

  [/\border-orange-500\b/g, "border-fuchsia-500"],
  [/\bfocus:border-orange-500\/50\b/g, "focus:border-violet-500/50"],
  [/\bfocus:ring-orange-500\/50\b/g, "focus:ring-violet-500/50"],
  
  [/\bfrom-orange-500\b/g, "from-violet-500"],
  [/\bvia-red-500\b/g, "via-fuchsia-500"],
  [/\bto-orange-400\b/g, "to-rose-400"],
  
  [/\bfrom-indigo-50\b/g, "from-violet-50"],
  [/\bvia-purple-50\b/g, "via-fuchsia-50"],
  [/\bto-orange-50\b/g, "to-rose-50"],
  
  [/\bbg-orange-500\/15\b/g, "bg-violet-500/15"],
  [/\bshadow-orange-500\/25\b/g, "shadow-violet-500/25"],
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  
  // Specific fix for Cards hover state since we are moving to a glassy UI
  if (filePath.includes('Cards.tsx')) {
      content = content.replace(/bg-white\/70\/\[0\.03\]/g, "bg-white/40 backdrop-blur-md");
      content = content.replace(/hover:bg-white\/70\/\[0\.05\]/g, "hover:bg-white/60");
      // Some classes might have gotten messed up by multiple passes
      content = content.replace(/bg-white\/\[0\.03\]/g, "bg-white/40 backdrop-blur-md");
      content = content.replace(/bg-white\/\[0\.05\]/g, "bg-white/60 backdrop-blur-md");
  }

  // Ensure modals have correct glassy effect
  if (filePath.includes('App.tsx') || filePath.includes('LandingPage.tsx')) {
      // Fix potential nested white/70
      content = content.replace(/bg-white\/70\/70/g, "bg-white/70");
      content = content.replace(/bg-white\/40\/80/g, "bg-white/60");
  }

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated Sunset theme in ${filePath}`);
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
