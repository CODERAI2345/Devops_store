const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const t = '        </StaggerContainer>\n        </FadeIn>\n      </section>\n\n      {/* ================= DOMAINS ================= */}';
if (lp.includes(t)) {
  lp = lp.replace(t, '        </div>\n        </FadeIn>\n      </section>\n\n      {/* ================= DOMAINS ================= */}');
}

fs.writeFileSync('src/components/LandingPage.tsx', lp);
