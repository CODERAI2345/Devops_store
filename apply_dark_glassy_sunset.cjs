const fs = require('fs');

const replacements = [
  // index.css Body - Midnight Indigo with ambient violet/fuchsia gradients
  [/background: linear-gradient\(135deg, \#eef2ff 0%, \#fff1f2 50%, \#fae8ff 100%\);\n  background-attachment: fixed;/g, "background: linear-gradient(135deg, #09090b 0%, #0f1025 50%, #200d29 100%);\n  background-attachment: fixed;"],
  [/color:\s*#1e1b4b;/g, "color: #ffffff;"],
  
  // index.css custom scrollbar
  [/rgba\(49, 46, 129, 0\.1\)/g, "rgba(217, 70, 239, 0.15)"],
  [/rgba\(49, 46, 129, 0\.2\)/g, "rgba(217, 70, 239, 0.3)"],

  // Colors: Text
  [/\btext-indigo-950\b/g, "text-white"],
  [/\btext-indigo-900\/80\b/g, "text-slate-300"],
  [/\btext-indigo-900\/60\b/g, "text-slate-400"],
  [/\btext-indigo-900\/40\b/g, "text-slate-500"],
  [/\btext-indigo-900\b/g, "text-slate-200"],
  [/\bplaceholder-indigo-900\/30\b/g, "placeholder-white/30"],
  
  // Modals & Backdrops
  [/\bbg-white\/40 backdrop-blur-xl border border-white\/50 shadow-2xl shadow-indigo-900\/10\b/g, "bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(217,70,239,0.15)]"],
  [/\bbg-indigo-950\/20 backdrop-blur-sm\b/g, "bg-black/60 backdrop-blur-sm"],

  // Backgrounds (Frosted Glass)
  [/\bbg-white\/70\b/g, "bg-black/20"], 
  [/\bbg-white\/40 backdrop-blur-md\b/g, "bg-white/[0.03] backdrop-blur-xl"],
  [/\bbg-white\/60 backdrop-blur-md\b/g, "bg-white/[0.05] backdrop-blur-xl"],
  [/\bbg-white\/40\b/g, "bg-white/[0.03]"],
  [/\bbg-white\/60\b/g, "bg-white/[0.05]"],
  [/\bbg-indigo-50\/50\b/g, "bg-white/[0.03]"],
  [/\bbg-indigo-900\/5\b/g, "bg-black/30"],
  [/\bbg-\[\#090d20\]\/60\b/g, "bg-white/[0.02]"],
  [/\bbg-\[\#04060e\]\b/g, "bg-transparent"],
  [/\bbg-slate-50\b/g, "bg-black/40"],
  
  // Borders
  [/\bborder-white\/50\b/g, "border-white/10"],
  [/\bborder-white\/40\b/g, "border-white/10"],
  [/\bborder-indigo-100\/50\b/g, "border-white/10"],
  
  // Hovers
  [/\bhover:bg-white\/60\b/g, "hover:bg-white/[0.08]"],
  [/\bhover:bg-white\/80\b/g, "hover:bg-white/[0.1]"],
  [/\bhover:border-indigo-200\/50\b/g, "hover:border-fuchsia-500/40"],
  [/\bhover:border-indigo-300\/50\b/g, "hover:border-fuchsia-500/40"],

  // Shadows
  [/\bshadow-\[0_8px_30px_rgba\(49,46,129,0\.08\)\]\b/g, "shadow-[0_8px_30px_rgba(217,70,239,0.1)]"],

  // Accents / Brand (Electric Fuchsia & Violet Gradients)
  [/\btext-fuchsia-600\b/g, "text-fuchsia-400"],
  [/\btext-violet-600\b/g, "text-fuchsia-400"],
  [/\btext-violet-500\b/g, "text-fuchsia-500"],
  
  [/\bbg-fuchsia-100\/50\b/g, "bg-fuchsia-500/10"],
  
  // CTA buttons gradient conversion
  [/\bbg-violet-600\b/g, "bg-gradient-to-r from-violet-600 to-fuchsia-600"],
  [/\bbg-violet-500\b/g, "bg-gradient-to-r from-violet-500 to-fuchsia-500"],
  [/\bhover:bg-violet-500\b/g, "hover:from-violet-500 hover:to-fuchsia-500"],
  [/\bhover:bg-violet-600\b/g, "hover:from-violet-600 hover:to-fuchsia-600"],
  
  [/\bshadow-violet-500\/25\b/g, "shadow-fuchsia-500/25"],
  [/\bborder-fuchsia-500\b/g, "border-fuchsia-500"],
  
  // LandingPage specific fixes for Hero Gradient text to match Figma vibe
  [/\bbg-gradient-to-r from-orange-400 via-orange-500 to-red-400\b/g, "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-rose-400"],
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
    console.log(`Updated to Dark Glassy Sunset in ${filePath}`);
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
