const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// The Why DevOps Store cards StaggerContainer needs to be closed at the end of the cards
lp = lp.replace(
  /<p className="text-sm leading-relaxed text-slate-400">\{feature\.description\}<\/p>\n              <\/div>\n            <\/StaggerItem>\n          \)\)\}\n        <\/div>/g,
  '<p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>\n              </div>\n            </StaggerItem>\n          ))}\n        </StaggerContainer>'
);

// Remove the errant </StaggerContainer> before DOMAINS
lp = lp.replace(
  /<\/div>\n        <\/StaggerContainer>\n        <\/FadeIn>\n      <\/section>\n\n      \{\/\* ================= DOMAINS/g,
  '</div>\n        </div>\n        </FadeIn>\n      </section>\n\n      {/* ================= DOMAINS'
);

fs.writeFileSync('src/components/LandingPage.tsx', lp);
