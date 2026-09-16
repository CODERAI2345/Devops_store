const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldAdminStart = `  if (view === "admin") {
    if (!isAdminAuth) {`;
    
const oldBackground = `    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

const newBackground = `    return (
      <div className="min-h-screen bg-[#000000] text-[#EDEDED] font-sans relative z-0 flex">
        {/* Professional Enterprise Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000]">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)]" />
        </div>
        {/* Sidebar */}
        <div className="w-64 border-r border-[#27272A] bg-[#09090B] hidden md:flex flex-col relative z-10 sticky top-0 h-screen">`;

code = code.replace(oldBackground, newBackground);

const oldMobileTabs = `<div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">`;
const newMobileTabs = `<div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar border-b border-[#27272A]">`;
code = code.replace(oldMobileTabs, newMobileTabs);

const oldSidebarItem = `                        className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 \${adminTab === t ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}\`}`;
const newSidebarItem = `                        className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors \${adminTab === t ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"}\`}`;
code = code.split(oldSidebarItem).join(newSidebarItem);

const oldAddBox = `<div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">`;
const newAddBox = `<div className="bg-[#09090B] border border-[#27272A] rounded-xl p-6 mb-8 shadow-sm">`;
code = code.replace(oldAddBox, newAddBox);

const oldTitleIcon = `<Sparkles className="w-5 h-5 text-orange-400" />`;
const newTitleIcon = `<div className="w-2 h-4 bg-white rounded-sm" />`;
code = code.replace(oldTitleIcon, newTitleIcon);

const oldInputBase = `className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"`;
const newInputBase = `className="flex-1 bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-sm"`;
code = code.replace(oldInputBase, newInputBase);

const oldAddBtn = `className="px-8 py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[120px] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"`;
const newAddBtn = `className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 font-medium rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] shadow-sm"`;
code = code.replace(oldAddBtn, newAddBtn);

fs.writeFileSync('src/App.tsx', code);
