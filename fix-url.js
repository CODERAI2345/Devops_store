import fs from 'fs';
let code = fs.readFileSync('src/utils.ts', 'utf8');

const regex = /urn:li:share:" \+ digitMatch\[1\]/g;
code = code.replace(regex, 'urn:li:activity:" + digitMatch[1]');

fs.writeFileSync('src/utils.ts', code);
