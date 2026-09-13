import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importRegex = /import \{([^\}]+)\} from "\.\/utils";/;
code = code.replace(importRegex, (match, imports) => {
    if (!imports.includes('extractLinkedInAuthor')) {
        return `import { ${imports.trim()}, extractLinkedInAuthor } from "./utils";`;
    }
    return match;
});

const submitRegex = /item\.author = "Author";/;
code = code.replace(submitRegex, `item.author = extractLinkedInAuthor(manualScreenshot.url) || "LinkedIn Post";`);

fs.writeFileSync('src/App.tsx', code);
