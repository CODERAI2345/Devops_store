const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
content = content.replace(/<StaggerItem>\s*<\/StaggerItem>/g, '');
fs.writeFileSync('src/components/LandingPage.tsx', content);
