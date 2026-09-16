const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCode = `                    {(adminTab === "li" || adminTab === "lp") && (
                      <div className="flex flex-col gap-2 mt-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input 
                          className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"
                          placeholder={adminTab === "lp" ? "Post Topic" : "Profile Name"}
                          value={item.title || ""}
                          onChange={(e) =>
                            updateItem(adminTab, item.id, { title: e.target.value })
                          }
                        />`;

const newCode = `                    {(adminTab === "li" || adminTab === "lp") && (
                      <div className="flex flex-col gap-2 mt-1 w-full" onClick={(e) => e.stopPropagation()}>`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', code);
