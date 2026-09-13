const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Insert color overrides in @theme
css = css.replace('@theme {', `@theme {
  --color-emerald-400: #78dbd0;
  --color-emerald-500: #53CABE;
  --color-emerald-600: #42a298;
`);

fs.writeFileSync('src/index.css', css);
