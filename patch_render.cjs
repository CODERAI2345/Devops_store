const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'if (tabToRender === "ig")',
  'if (tabToRender === "ig" || tabToRender === "igp")'
);

fs.writeFileSync('src/App.tsx', code);
