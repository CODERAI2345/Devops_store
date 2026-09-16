const fs = require('fs');
let content = fs.readFileSync('src/hooks/useCentralHub.ts', 'utf-8');

// Update initial state
content = content.replace(
  /th: \[\],\n  \}\);/,
  'igp: [],\n    th: [],\n    web: [],\n    lab: [],\n  });'
);

// Update snapshot initialization
content = content.replace(
  /const newDb: HubDB = \{ yt: \[\], ys: \[\], ypl: \[\], li: \[\], lp: \[\], blog: \[\], email: \[\], tw: \[\], git: \[\], ig: \[\], igp: \[\], th: \[\] \};/,
  'const newDb: HubDB = { yt: [], ys: [], ypl: [], li: [], lp: [], blog: [], email: [], tw: [], git: [], ig: [], igp: [], th: [], web: [], lab: [] };'
);

fs.writeFileSync('src/hooks/useCentralHub.ts', content);
console.log('useCentralHub.ts patched.');
