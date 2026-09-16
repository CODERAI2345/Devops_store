const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/\{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" \/>\}/g, '{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}\n                      {t === "th" && <span className="w-3.5 h-3.5 text-white flex items-center justify-center font-bold text-sm leading-none">@</span>}');

fs.writeFileSync('src/App.tsx', code);
