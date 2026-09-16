const fs = require('fs');

function replaceFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  content = replacer(content);
  fs.writeFileSync(path, content);
}

replaceFile('src/components/LandingPage.tsx', (content) => {
  return content.replace('bg-[#080b1d]', 'bg-white');
});

replaceFile('src/components/AdminExport.tsx', (content) => {
  return content.replace(/bg-\[\#080b1d\]/g, 'bg-slate-50');
});

