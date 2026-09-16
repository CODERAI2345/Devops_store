const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const emptyBlock = `    if (!items.length) {
      return (
        <div className="text-center py-32 text-slate-200 border border-white/10 border-dashed rounded-2xl bg-black/20/[0.02] flex flex-col items-center">
          <LayoutGrid className="w-16 h-16 mx-auto mb-6 text-slate-500 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No content found</h3>
          <p className="text-sm text-slate-400 mb-6">Try adjusting your filters or search query.</p>
          {(q || showStarredOnly || selectedLPTag || searchDate) && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setShowStarredOnly(false);
                setSelectedLPTag("");
                setSearchDate("");
              }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-medium border border-white/10"
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }`;

content = content.replace(/    if \(\!items\.length\) \{[\s\S]*?    \}/, emptyBlock);

fs.writeFileSync('src/App.tsx', content);
