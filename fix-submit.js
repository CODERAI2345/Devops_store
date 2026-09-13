import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importRegex = /import \{([^\}]+)\} from "\.\/utils";/;
code = code.replace(importRegex, (match, imports) => {
    if (!imports.includes('guessCategoryFromUrl')) {
        return `import { ${imports.trim()}, guessCategoryFromUrl } from "./utils";`;
    }
    return match;
});

const submitRegex = /if \(adminTab === "lp"\) \{[\s\S]*?\} else \{/;
const replacement = `if (adminTab === "lp") {
        item.heading = manualScreenshot.profileName || guessCategoryFromUrl(manualScreenshot.url) || "";
        item.title = "LinkedIn Post";
        item.author = "Author";
      } else {`;
      
code = code.replace(submitRegex, replacement);

const inputChangeRegex = /onChange=\{\(e\) =>\s*setManualScreenshot\(\{\s*\.\.\.manualScreenshot,\s*url:\s*e\.target\.value,\s*\}\)\s*\}/;
const inputChangeReplacement = `onChange={(e) => {
                        const newUrl = e.target.value;
                        const guessedCategory = guessCategoryFromUrl(newUrl);
                        setManualScreenshot({
                          ...manualScreenshot,
                          url: newUrl,
                          profileName: guessedCategory || manualScreenshot.profileName,
                        });
                      }}`;
code = code.replace(inputChangeRegex, inputChangeReplacement);

fs.writeFileSync('src/App.tsx', code);
