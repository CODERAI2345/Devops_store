const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

lp = lp.replace(
  '          </div>\n        </StaggerContainer>\n        </FadeIn>\n      </section>\n\n      {/* ================= DOMAINS',
  '          </div>\n        </div>\n        </FadeIn>\n      </section>\n\n      {/* ================= DOMAINS'
);

fs.writeFileSync('src/components/LandingPage.tsx', lp);
