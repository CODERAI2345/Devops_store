const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Fix the paragraph issue
lp = lp.replace(
  /<StaggerItem className="mt-7 max-w-xl text-lg leading-8 text-slate-300" as="p">/g,
  '<StaggerItem>\n              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">'
);
lp = lp.replace(
  /knowledge openly\.\n\s*<\/p>/g,
  'knowledge openly.\n              </p>\n            </StaggerItem>'
);

// Fix the `</div>` mismatch in Hero.
// The StaggerContainer replaced `<div>\n            <div className="mb-7`, 
// So the StaggerContainer replaces the outer <div>.
// At the end of the LEFT section, there's `</div>`. We replaced `</button>\n            </div>` with `</button> </div> </StaggerItem> </StaggerContainer>` but we missed removing the `</div>` that closed the LEFT section! Or we added `</StaggerContainer>` too early.
// Let's just find the whole HERO LEFT section and rewrite it cleanly.
