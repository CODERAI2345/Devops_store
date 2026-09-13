const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const igParser = `      } else if (t === "ig") {
        try {
          const res = await fetch(\`https://api.microlink.io/?url=\${encodeURIComponent(url)}\`);
          const d = await res.json();
          const { extractInstagramShortcode } = await import('./utils');
          const shortcode = extractInstagramShortcode(url) || "";
          
          meta = {
            ...meta,
            title: d.data?.title || "Instagram Post",
            author: d.data?.author || "Instagram User",
            description: d.data?.description || "",
            thumbnail: d.data?.image?.url || "",
            shortcode,
            tags: [],
          };
        } catch (err) {
          const { extractInstagramShortcode } = await import('./utils');
          const shortcode = extractInstagramShortcode(url) || "";
          meta = {
            ...meta,
            title: "Instagram Post",
            author: "Instagram User",
            description: "",
            thumbnail: "",
            shortcode,
            tags: [],
          };
        }
`;

content = content.replace('      } else if (t === "lp" || t === "li") {', igParser + '      } else if (t === "lp" || t === "li") {');

fs.writeFileSync('src/App.tsx', content);
