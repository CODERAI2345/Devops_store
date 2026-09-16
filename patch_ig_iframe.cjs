const fs = require('fs');
let content = fs.readFileSync('src/components/InstagramModal.tsx', 'utf-8');

// Update iframe classes and src
// We'll give it a taller height specifically suited for reels (9:16 aspect ratio roughly)
content = content.replace(
  /<iframe\s+src=\{`https:\/\/www\.instagram\.com\/p\/\$\{item\.shortcode\}\/embed\/captioned`\}\s+className="w-full min-h-\[480px\] max-h-\[550px\] border-0"\s+allow="encrypted-media"\s+scrolling="yes"\s+onError=\{\(\) => setIframeFailed\(true\)\}\s+><\/iframe>/g,
  `<iframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
              className="w-full min-h-[600px] h-[75vh] border-0"
              allow="encrypted-media"
              scrolling="no"
              onError={() => setIframeFailed(true)}
            ></iframe>`
);

// Remove the max-h from the content container to allow it to fill properly
content = content.replace(
  /<div className="w-full flex justify-center bg-black\/20 rounded-3xl overflow-hidden shadow-\[0_20px_60px_rgba\(0,0,0,0\.5\)\] max-h-\[85vh\] overflow-y-auto custom-scrollbar">/g,
  '<div className="w-full flex-1 flex justify-center bg-black/20 rounded-b-2xl overflow-hidden shadow-[inset_0_20px_60px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">'
);

fs.writeFileSync('src/components/InstagramModal.tsx', content);
console.log('Instagram iframe patched.');
