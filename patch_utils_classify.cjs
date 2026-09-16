const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf-8');

code = code.replace(
  '| "ig" | null {',
  '| "ig" | "th" | null {'
);

code = code.replace(
  '  if (u.toLowerCase().includes("instagram.com") || u.toLowerCase().includes("instagr.am")) return "ig";',
  '  if (u.toLowerCase().includes("instagram.com") || u.toLowerCase().includes("instagr.am")) return "ig";\n  if (u.toLowerCase().includes("threads.net")) return "th";'
);

fs.writeFileSync('src/utils.ts', code);
