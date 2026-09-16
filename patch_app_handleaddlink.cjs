const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'extractInstagramShortcode }',
  'extractInstagramShortcode, extractThreadsShortcode }'
);

code = code.replace(
  'if (t === "ig") item.shortcode = meta.shortcode || "";',
  'if (t === "ig") item.shortcode = meta.shortcode || "";\n      if (t === "th") item.shortcode = meta.shortcode || "";'
);

code = code.replace(
  'if (t === "ig") {\n        setModalDefaultEditing(true);',
  'if (t === "ig" || t === "th") {\n        setModalDefaultEditing(true);'
);

const thLogic = `} else if (t === "th") {
        const shortcode = extractThreadsShortcode(url) || "";
        try {
          const res = await fetch(\`https://api.microlink.io/?url=\${encodeURIComponent(url)}\`);
          const d = await res.json();
          meta = {
            ...meta,
            title: d.data?.title || "Threads Post",
            author: d.data?.author || "Threads User",
            description: d.data?.description || "Embedded Threads Content",
            thumbnail: d.data?.image?.url || "",
            shortcode,
            tags: [],
          };
        } catch (e) {
          meta = {
            ...meta,
            title: "Threads Post",
            author: "Threads User",
            description: "Embedded Threads Content",
            thumbnail: "",
            shortcode,
            tags: [],
          };
        }
      `;

code = code.replace(
  '} else if (t === "ig") {',
  `${thLogic}} else if (t === "ig") {`
);

fs.writeFileSync('src/App.tsx', code);
