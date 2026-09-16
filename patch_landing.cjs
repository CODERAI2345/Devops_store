const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

content = content.replace(
  /<StaggerItem className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">\s*DevOps Store\s*<br \/>/,
  '<StaggerItem className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">\n              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">DevOps Store</span>\n              <br />'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
