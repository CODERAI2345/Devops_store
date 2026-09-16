const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

code = code.replace(
  'item.type === "ig" && item.shortcode ? (',
  'item.type === "th" && item.shortcode ? (\n              <div className="w-full min-h-[400px] max-h-[600px] flex justify-center bg-white overflow-hidden relative rounded-xl">\n                 <iframe\n                   src={`https://www.threads.net/t/${item.shortcode}/embed`}\n                   width="100%"\n                   height="100%"\n                   frameBorder="0"\n                   scrolling="yes"\n                   allow="encrypted-media"\n                   className="w-full h-full absolute inset-0 bg-white"\n                 ></iframe>\n              </div>\n            ) : item.type === "ig" && item.shortcode ? ('
);

code = code.replace(
  'item.type === "ig" || item.type === "li") && (',
  'item.type === "ig" || item.type === "li" || item.type === "th") && ('
);

fs.writeFileSync('src/components/Modal.tsx', code);
