const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const originalNavBtn = `<button
              onClick={() => setView('feed')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/30"
            >
              Explore Desk <ArrowRight size={16} />
            </button>`;

const newNavBtn = `<div className="relative inline-flex group rounded-xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90" />
              </div>
              <button
                onClick={() => setView('feed')}
                className="relative m-[2px] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-5 py-3 text-sm font-semibold transition hover:from-violet-800 hover:to-fuchsia-800"
              >
                Explore Desk <ArrowRight size={16} className="text-fuchsia-300" />
              </button>
            </div>`;

content = content.replace(originalNavBtn, newNavBtn);

fs.writeFileSync('src/components/LandingPage.tsx', content);

console.log('Nav button patched.');
