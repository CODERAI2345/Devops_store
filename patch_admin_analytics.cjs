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
    'const [adminTab, setAdminTab] = useState<ItemType | "analytics">("analytics");' // default to analytics
);

// 3. Add Analytics button to sidebar
const oldSidebarTitle = `<div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2 mt-4 px-2">Content Types</div>`;
const newSidebarTitle = `<button
                        className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-4 \${adminTab === "analytics" ? "bg-[#27272A] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-[#18181B]"}\`}
                        onClick={() => setAdminTab("analytics")}
                    >
                        <BarChart className="w-4 h-4" />
                        Analytics
                    </button>
                    <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2 px-2">Content Types</div>`;

code = code.replace(oldSidebarTitle, newSidebarTitle);

// 4. Add Analytics button to mobile tabs
const oldMobileTabs = `{(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (`;
const newMobileTabs = `<button
                    className={\`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap \${adminTab === "analytics" ? "border-b-2 border-[#EDEDED] text-[#EDEDED]" : "text-[#A1A1AA] hover:text-[#EDEDED]"}\`}
                    onClick={() => setAdminTab("analytics")}
                  >
                    Analytics
                  </button>
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"] as ItemType[]).map((t) => (`;

code = code.replace(oldMobileTabs, newMobileTabs);

// 5. Render the Analytics Dashboard
const oldAdminContent = `// If there's an active DB tab, handle that logic`; // Wait, I need to find a good place.
const oldContentStart = `<div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto">`;
const newContentStart = `<div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto">
            {adminTab === "analytics" ? (
                <AnalyticsDashboard />
            ) : (
                <>`;

code = code.replace(oldContentStart, newContentStart);

// Close the fragment at the end of the admin section
const oldContentEnd = `</div>
            
            <div className="p-4 border-t border-[#27272A] space-y-2">`;
            
const newContentEnd = `</>
            )}
            </div>
            
            <div className="p-4 border-t border-[#27272A] space-y-2">`;

// Be careful with oldContentEnd replacing the wrong one. Let's find exactly the end of the flex-1 div.
// It's right before the 2nd sidebar or the footer. Actually the sidebar is separate.
// Let's replace the whole structure.
