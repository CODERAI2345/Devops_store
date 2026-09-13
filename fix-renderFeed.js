import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const renderFeed = \(\) => \{[\s\S]*?return \(\s*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">/;

const replacement = `const renderFeed = () => {
    if (isInitialLoading) {
      return (
        <div className="py-32 flex flex-col items-center justify-center text-white/50">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
          <p className="font-medium tracking-wide">Syncing your hub...</p>
        </div>
      );
    }

    const q = searchQuery.toLowerCase();
    let items = db[currentTab];

    if (showStarredOnly) {
      items = items.filter((x) => x.starred) as any;
    }

    if (currentTab === "lp" && selectedLPTag) {
      items = items.filter((x: any) => x.heading?.toLowerCase().includes(selectedLPTag.toLowerCase()) || x.title?.toLowerCase().includes(selectedLPTag.toLowerCase())) as any;
    }

    if (q) {
      items = items.filter((x) =>
        [x.title, x.author, x.description, (x as any).company, (x as any).role, x.url, x.heading].some(
          (s) => s && s.toLowerCase().includes(q),
        ),
      ) as any;
    }

    if (!items.length) {
      return (
        <div className="text-center py-32 text-white/30 border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium tracking-wide">No content found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
