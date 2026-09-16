const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const originalBtn = `<div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => setView('feed')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-semibold shadow-lg shadow-fuchsia-500/25 transition-all duration-300 group hover:-translate-y-1 hover:from-violet-500 hover:to-fuchsia-500"
                >
                  Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>`;

const newBtn = `<div className="mt-9 flex flex-wrap gap-4">
                <div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/40 rounded-xl">
                  {/* Outer animated spark wrapper */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90" />
                  </div>
                  {/* Inner Button */}
                  <button
                    onClick={() => setView('feed')}
                    className="relative m-[2px] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-6 py-4 font-semibold text-white transition-colors hover:from-violet-800 hover:to-fuchsia-800"
                  >
                    Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-fuchsia-300" />
                  </button>
                </div>
              </div>`;

content = content.replace(originalBtn, newBtn);

fs.writeFileSync('src/components/LandingPage.tsx', content);

console.log('Button patched.');
