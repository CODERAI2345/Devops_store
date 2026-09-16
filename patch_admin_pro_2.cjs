const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Mobile tabs update
const oldMobileTabs = `<div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border \${adminTab === t ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-white/5 text-white/60 border-white/10"}\`}
                    onClick={() => setAdminTab(t)}
                  >`;

const newMobileTabs = `<div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar border-b border-[#27272A]">
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    className={\`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap \${adminTab === t ? "border-b-2 border-[#EDEDED] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED]"}\`}
                    onClick={() => setAdminTab(t)}
                  >`;
code = code.replace(oldMobileTabs, newMobileTabs);


// 2. Add Link Box
const oldAddBox = `<div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-orange-400" />
                 Add New {adminTab === "yt" ? "YouTube Video" : adminTab === "ypl" ? "YouTube Playlist" : adminTab === "ys" ? "Short" : adminTab === "blog" ? "Blog" : adminTab === "email" ? "Email" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X Link" : adminTab === "git" ? "GitHub Repo" : adminTab === "ig" ? "Instagram Reels" : adminTab === "igp" ? "Instagram Post" : adminTab === "th" ? "Threads" : "Link"}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"`;

const newAddBox = `<div className="bg-[#09090B] border border-[#27272A] rounded-xl p-6 mb-8 shadow-sm">
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2 text-[#EDEDED]">
                 <div className="w-1.5 h-4 bg-[#EDEDED] rounded-sm" />
                 Add New {adminTab === "yt" ? "YouTube Video" : adminTab === "ypl" ? "YouTube Playlist" : adminTab === "ys" ? "Short" : adminTab === "blog" ? "Blog" : adminTab === "email" ? "Email" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X Link" : adminTab === "git" ? "GitHub Repo" : adminTab === "ig" ? "Instagram Reels" : adminTab === "igp" ? "Instagram Post" : adminTab === "th" ? "Threads" : "Link"}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 bg-[#000000] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-[#EDEDED] placeholder-[#71717A] focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-colors"`;

code = code.replace(oldAddBox, newAddBox);

const oldAddBtn = `className="px-8 py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[120px] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"`;
const newAddBtn = `className="px-6 py-2.5 bg-[#EDEDED] text-black hover:bg-white font-medium rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] shadow-sm"`;
code = code.replace(oldAddBtn, newAddBtn);

fs.writeFileSync('src/App.tsx', code);
