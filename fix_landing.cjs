const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Fix hover gradients
content = content.replace(/hover:bg-gradient-to-r from-violet-500 to-fuchsia-500/g, "hover:from-violet-500 hover:to-fuchsia-500");

// Fix the light gradient in SHARE section
content = content.replace(/bg-gradient-to-r from-violet-50 via-fuchsia-50 to-rose-50/g, "bg-gradient-to-r from-[#17103a] via-[#1a0a22] to-[#31102f]");

// Fix old orange shadow hover
content = content.replace(/hover:shadow-orange-500\/30/g, "hover:shadow-fuchsia-500/30");

// Fix pulse animations in SHARE section
content = content.replace(/bg-fuchsia-500\/10 blur-3xl/g, "bg-fuchsia-500/20 blur-3xl");
content = content.replace(/bg-purple-500\/20 blur-3xl/g, "bg-violet-500/20 blur-3xl");

fs.writeFileSync('src/components/LandingPage.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(/hover:bg-gradient-to-r from-violet-500 to-fuchsia-500/g, "hover:from-violet-500 hover:to-fuchsia-500");
fs.writeFileSync('src/App.tsx', appContent);
