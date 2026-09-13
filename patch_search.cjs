const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `    if (q) {
      items = items.filter((x) =>
        [x.title, x.author, x.description, (x as any).company, (x as any).role, x.url, (x as any).heading, x.date].some(
          (s) => s && s.toLowerCase().includes(q),
        ),
      ) as any;
    }`;

const replaceStr = `    if (q) {
      items = items.filter((x) => {
        const searchableFields = [
          x.title,
          x.author,
          x.description,
          (x as any).company,
          (x as any).role,
          x.url,
          (x as any).heading,
          x.date,
          (x as any).platform,
          (x as any).handle,
          (x as any).location,
          (x as any).postType,
        ];
        
        if (Array.isArray((x as any).topics)) searchableFields.push(...(x as any).topics);
        if (Array.isArray((x as any).tags)) searchableFields.push(...(x as any).tags);
        if (Array.isArray((x as any).skills)) searchableFields.push(...(x as any).skills);

        return searchableFields.some(
          (s) => s && typeof s === 'string' && s.toLowerCase().includes(q)
        );
      }) as any;
    }`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/App.tsx', code);
