const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

code = code.replace('<div className="absolute inset-0 z-10"></div>', '');

fs.writeFileSync('src/components/Cards.tsx', code);
