const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'if (t === "ig" || t === "th") {\n        setModalDefaultEditing(true);',
  'if (t === "ig" || t === "igp" || t === "th") {\n        setModalDefaultEditing(true);'
);

fs.writeFileSync('src/App.tsx', code);
