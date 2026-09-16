const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the deep blue gradient with a sleeker, darker SaaS background
const oldAdminLayout = `    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

const newAdminLayout = `    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans relative z-0 flex">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

code = code.replace(oldAdminLayout, newAdminLayout);

// Also replace the input container and list items
const oldInputArea = `<div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">`;
const newInputArea = `<div className="bg-[#121212]/80 border border-white/5 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 pointer-events-none" />`;
code = code.replace(oldInputArea, newInputArea);

const oldItemRow = `className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group"`;
const newItemRow = `className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#121212]/60 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#1A1A1A]/80 hover:border-white/10 transition-all group shadow-sm"`;
code = code.replace(oldItemRow, newItemRow);

// Improve input styles in the item rows (Ghost style for cleaner layout)
const oldInputStyle = `className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"`;
const newInputStyle = `className="w-full max-w-[300px] bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 focus:bg-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 focus:outline-none transition-all"`;
code = code.split(oldInputStyle).join(newInputStyle);

fs.writeFileSync('src/App.tsx', code);
