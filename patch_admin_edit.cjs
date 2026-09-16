const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldLiEdit = `                    {(adminTab === "li" || adminTab === "lp") && (
                      <div className="flex flex-col gap-2 mt-3" onClick={(e) => e.stopPropagation()}>`;

const newLiEdit = `                    {(adminTab === "li" || adminTab === "lp" || adminTab === "ig" || adminTab === "igp" || adminTab === "th" || adminTab === "tw" || adminTab === "git" || adminTab === "yt" || adminTab === "ys" || adminTab === "ypl") && (
                      <div className="flex flex-col gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                        <input 
                          className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"
                          placeholder={adminTab === "lp" ? "Post Topic" : adminTab === "ig" || adminTab === "igp" || adminTab === "th" || adminTab === "tw" ? "Topic / Title" : "Title / Name"}
                          value={item.title || ""}
                          onChange={(e) =>
                            updateItem(adminTab, item.id, { title: e.target.value })
                          }
                        />
                      </div>
                    )}
                    {(adminTab === "li" || adminTab === "lp") && (
                      <div className="flex flex-col gap-2 mt-1 w-full" onClick={(e) => e.stopPropagation()}>`;

code = code.replace(oldLiEdit, newLiEdit);
fs.writeFileSync('src/App.tsx', code);
