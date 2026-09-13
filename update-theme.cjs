const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('@theme {', `@theme {
  --color-emerald-400: #53CABE;
  --color-emerald-500: #53CABE;
  --color-emerald-600: #42a298;
`);
fs.writeFileSync('src/index.css', css);
