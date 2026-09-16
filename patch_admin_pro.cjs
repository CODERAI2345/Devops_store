const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Replace the entire login view and main layout bg
const oldLoginBg = `<div className="fixed inset-0 bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white flex items-center justify-center p-4">
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
          </div>
          
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] transform transition-all scale-100 animate-fade-in-up relative z-10">`;

const newLoginBg = `<div className="fixed inset-0 bg-black text-[#EDEDED] flex items-center justify-center p-4 font-sans">
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000]">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)]" />
          </div>
          
          <div className="bg-[#0A0A0A] border border-[#27272A] p-8 rounded-xl w-full max-w-sm shadow-2xl relative z-10">`;

code = code.replace(oldLoginBg, newLoginBg);

const oldLoginBtn = `className="w-full mt-2 py-4 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"`;
const newLoginBtn = `className="w-full mt-4 py-3 bg-[#EDEDED] text-black hover:bg-white font-medium text-sm rounded-md transition-colors"`;
code = code.replace(oldLoginBtn, newLoginBtn);

const oldLoginInput = `className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"`;
const newLoginInput = `className="w-full bg-[#000000] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-[#EDEDED] placeholder-[#71717A] focus:outline-none focus:border-[#EDEDED] transition-colors"`;
code = code.split(oldLoginInput).join(newLoginInput);


// 2. Replace the main Admin Layout
const oldMainLayout = `<div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>

        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

const newMainLayout = `<div className="min-h-screen bg-[#000000] text-[#EDEDED] font-sans relative z-0 flex">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000]">
          <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#27272A] to-transparent"></div>
        </div>

        {/* Sidebar */}
        <div className="w-64 border-r border-[#27272A] bg-[#09090B] hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

code = code.replace(oldMainLayout, newMainLayout);

// 3. Update Sidebar Items
const oldSidebarIconCont = `<div className="w-6 h-6 rounded bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center">`;
const newSidebarIconCont = `<div className="w-6 h-6 rounded bg-[#27272A] border border-[#3F3F46] flex items-center justify-center">`;
code = code.replace(oldSidebarIconCont, newSidebarIconCont);

const oldSidebarBtn = `className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 \${adminTab === t ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}\`}`;
const newSidebarBtn = `className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors \${adminTab === t ? "bg-[#27272A] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-[#18181B]"}\`}`;
code = code.split(oldSidebarBtn).join(newSidebarBtn);

const oldSidebarHeader = `border-b border-white/10`;
const newSidebarHeader = `border-b border-[#27272A]`;
code = code.split(oldSidebarHeader).join(newSidebarHeader);

fs.writeFileSync('src/App.tsx', code);
