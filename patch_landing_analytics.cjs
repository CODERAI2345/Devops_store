const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

if (!code.includes('logAnalyticsEvent')) {
    code = code.replace(
        'import { ItemType } from "../types";',
        'import { ItemType } from "../types";\nimport { logAnalyticsEvent } from "../analytics";'
    );
}

// Track tab switches in the landing page filter
code = code.replaceAll(
    'onClick={() => setFilter(t)}',
    'onClick={() => { setFilter(t); logAnalyticsEvent("tab_click", { category: t }); }}'
);

// If there's an 'All' filter reset
code = code.replaceAll(
    'onClick={() => setFilter(null)}',
    'onClick={() => { setFilter(null); logAnalyticsEvent("tab_click", { category: "all" }); }}'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
