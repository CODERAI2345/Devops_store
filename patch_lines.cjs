const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'if (t === "ig") item.shortcode = meta.shortcode || "";',
  'if (t === "ig" || t === "igp") item.shortcode = meta.shortcode || "";'
);

code = code.replace(
  'if (t === "ig" || t === "th") {\\n        setModalDefaultEditing(true);',
  'if (t === "ig" || t === "igp" || t === "th") {\\n        setModalDefaultEditing(true);'
);

code = code.replace(
  'shortcode: t === "ig" ? extractInstagramShortcode(url) || null : t === "th" ? extractThreadsShortcode(url) || null : null,',
  'shortcode: (t === "ig" || t === "igp") ? extractInstagramShortcode(url) || null : t === "th" ? extractThreadsShortcode(url) || null : null,'
);

fs.writeFileSync('src/App.tsx', code);
