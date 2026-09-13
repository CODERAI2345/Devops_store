import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">[\s\S]*?(?=\{renderFeed\(\)\})/;
const replacement = `<main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">
             <div className="mb-8 flex flex-col gap-6">
                 <div>
                     <h2 className="text-3xl font-display font-bold text-white mb-2">
                        {currentTab === "yt" ? "YouTube Videos" : currentTab === "ys" ? "YouTube Shorts" : currentTab === "lp" ? "LinkedIn Posts" : currentTab === "blog" ? "Articles & Blogs" : currentTab === "email" ? "Job Contacts" : currentTab === "hremail" ? "HR Contacts" : "Profiles"}
                     </h2>
                     <p className="text-white/50">Your curated collection of {currentTab === "lp" ? "posts" : "items"}.</p>
                 </div>
                 
                 {currentTab === "lp" && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <span className="text-emerald-400 shrink-0 mr-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Trending</span>
                        {["AWS", "Azure", "DevOps", "Terraform", "Linux", "Interview", "Career", "AI", "Networking"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedLPTag(selectedLPTag === tag ? "" : tag)}
                                className={\`px-4 py-1.5 rounded-full whitespace-nowrap transition-all border \${selectedLPTag === tag ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/10 border-white/5"}\`}
                            >
                                {tag}
                            </button>
                        ))}
                      </div>
                    </div>
                 )}
             </div>
             
             `;
code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
