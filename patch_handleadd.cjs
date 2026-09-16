const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  '} else if (t === "ig" || t === "th") {',
  '} else if (t === "ig" || t === "igp" || t === "th") {'
);

fs.writeFileSync('src/App.tsx', code);
