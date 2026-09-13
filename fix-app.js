import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const guessedCategory = guessCategoryFromUrl(newUrl);',
  'const guessedCategory = guessCategoryFromUrl(newUrl) || (adminTab === "lp" ? extractTopicFromLinkedInUrl(newUrl) : "");'
);

code = code.replace(
  'item.heading = manualScreenshot.profileName || guessCategoryFromUrl(manualScreenshot.url) || "";',
  'item.heading = manualScreenshot.profileName || guessCategoryFromUrl(manualScreenshot.url) || extractTopicFromLinkedInUrl(manualScreenshot.url) || "";'
);

fs.writeFileSync('src/App.tsx', code);
