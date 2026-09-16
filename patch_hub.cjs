const fs = require('fs');
let content = fs.readFileSync('src/hooks/useCentralHub.ts', 'utf-8');
content = content.replace(/\(\(data as any\)\.type as string\) = "igp"/g, '(data as any).type = "igp"');
fs.writeFileSync('src/hooks/useCentralHub.ts', content);
