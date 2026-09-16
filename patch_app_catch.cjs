const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'pid: t === "ypl" ? ytPlaylistId(url) || null : null,\n      } as any);',
  'pid: t === "ypl" ? ytPlaylistId(url) || null : null,\n        shortcode: t === "ig" ? extractInstagramShortcode(url) || null : t === "th" ? extractThreadsShortcode(url) || null : null,\n      } as any);'
);

fs.writeFileSync('src/App.tsx', code);
