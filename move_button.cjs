const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const heroButtonRegex = /<div className="mt-9 flex flex-wrap gap-4">\s*<div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500\/40 rounded-xl">\s*\{\/\* Outer animated spark wrapper \*\/\}\s*<div className="absolute inset-0 overflow-hidden rounded-xl">\s*<div className="absolute inset-\[-100%\] animate-\[spin_2\.5s_linear_infinite\] bg-\[conic-gradient\(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%\)\] opacity-90" \/>\s*<\/div>\s*\{\/\* Inner Button \*\/\}\s*<button\s*onClick=\{.*?\}\s*className="relative m-\[2px\] flex items-center gap-2 rounded-\[10px\] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-6 py-4 font-semibold text-white transition-colors hover:from-violet-800 hover:to-fuchsia-800"\s*>\s*Browse Resources <ArrowRight size=\{18\} className="transition-transform group-hover:translate-x-1 text-fuchsia-300" \/>\s*<\/button>\s*<\/div>\s*<\/div>/;

const buttonMatch = content.match(heroButtonRegex);

if (buttonMatch) {
    const buttonHtml = buttonMatch[0];
    
    // Remove from hero
    content = content.replace(heroButtonRegex, '');
    
    // Create a new section before the footer
    const newSection = `
      {/* ================= FINAL CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Ready to explore the <span className="text-fuchsia-400">DevOps Store?</span>
          </h2>
          <div className="flex justify-center">
            ${buttonHtml}
          </div>
        </FadeIn>
      </section>

      {/* ================= FOOTER ================= */}
      <footer`;
      
    content = content.replace(/<footer/, newSection);
    fs.writeFileSync('src/components/LandingPage.tsx', content);
    console.log("Moved button successfully.");
} else {
    console.log("Could not find the button to move.");
}

