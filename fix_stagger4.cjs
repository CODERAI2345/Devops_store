const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const t = '        </StaggerContainer>\n        </FadeIn>\n      </section>\n      {/* ================= DOMAINS';
if (lp.includes(t)) {
  lp = lp.replace(t, '        </div>\n        </FadeIn>\n      </section>\n      {/* ================= DOMAINS');
} else {
  console.log("Not found!");
}

fs.writeFileSync('src/components/LandingPage.tsx', lp);
