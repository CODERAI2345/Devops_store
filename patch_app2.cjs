const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.split('adminTab === "ig" ? "Instagram" : adminTab === "th"').join('adminTab === "ig" ? "Instagram Reels" : adminTab === "igp" ? "Instagram Post" : adminTab === "th"');

fs.writeFileSync('src/App.tsx', code);
