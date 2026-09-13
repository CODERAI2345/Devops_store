import fs from 'fs';
let code = fs.readFileSync('src/components/Cards.tsx', 'utf8');

code = code.replace(
    /<span className="text-sm font-medium text-white\/90 truncate">\{item\.title \|\| "LinkedIn Post"\}<\/span>/,
    '<span className="text-sm font-medium text-white/90 truncate">{item.author || "LinkedIn Post"}</span>'
);

fs.writeFileSync('src/components/Cards.tsx', code);
