const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add import
if (!code.includes('AnalyticsDashboard')) {
    code = code.replace(
        'import AdminExport from "./components/AdminExport";',
        'import AdminExport from "./components/AdminExport";\nimport { AnalyticsDashboard } from "./components/AnalyticsDashboard";'
    );
}

// 2. Add Analytics to useState type if not there
code = code.replace(
    'const [adminTab, setAdminTab] = useState<ItemType>("yt");',
    'const [adminTab, setAdminTab] = useState<ItemType | "analytics">("analytics");'
);

// 3. Add Analytics button to sidebar
const oldSidebarTitle = `<div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-4 px-2">Content Types</div>`;
const newSidebarTitle = `<button
                        className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-4 \${adminTab === "analytics" ? "bg-[#27272A] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-[#18181B]"}\`}
                        onClick={() => setAdminTab("analytics")}
                    >
                        <BarChart className="w-4 h-4" />
                        Analytics
                    </button>
                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-2">Content Types</div>`;

if (!code.includes('adminTab === "analytics"')) {
    code = code.replace(oldSidebarTitle, newSidebarTitle);
}

// 4. Add Analytics button to mobile tabs
const oldMobileTabs = `{(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (`;
const newMobileTabs = `<button
                    className={\`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap \${adminTab === "analytics" ? "border-b-2 border-[#EDEDED] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED]"}\`}
                    onClick={() => setAdminTab("analytics")}
                  >
                    Analytics
                  </button>
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (`;

if (!code.includes('Analytics\n                  </button>')) {
    code = code.replace(oldMobileTabs, newMobileTabs);
}

// 5. Render the Analytics Dashboard
const oldContentStart = `<div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto">
            
            <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar border-b border-[#27272A]">`;
const newContentStart = `<div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto">
            {adminTab === "analytics" ? (
                <AnalyticsDashboard />
            ) : (
                <>
            <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar border-b border-[#27272A]">`;

if (!code.includes('<AnalyticsDashboard />')) {
    code = code.replace(oldContentStart, newContentStart);
}

// 6. Close the fragment at the end of the admin section
const oldEnd = `                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- End Admin Console ---`;

const newEnd = `                  </div>
                </div>
              ))}
            </div>
          </>
          )}
          </div>
        </div>
      </div>
    );
  }

  // --- End Admin Console ---`;
  
if (!code.includes('</>\n          )}')) {
    code = code.replace(oldEnd, newEnd);
}

fs.writeFileSync('src/App.tsx', code);
