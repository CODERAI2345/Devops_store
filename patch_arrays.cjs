const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.split('["yt", "ypl", "ys", "lp", "tw", "ig", "th", "blog", "email", "git"]').join('["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"]');

code = code.split('{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}').join('{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}\n                      {t === "igp" && <Instagram className="w-3.5 h-3.5 text-pink-500" />}');

fs.writeFileSync('src/App.tsx', code);
