const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'import { YTCard, YPLCard, YSCard, LICard, LPCard, BlogCard, EmailCard, TWCard, GitCard, IGCard } from "./components/Cards";',
  'import { YTCard, YPLCard, YSCard, LICard, LPCard, BlogCard, EmailCard, TWCard, GitCard, IGCard, THCard } from "./components/Cards";'
);

code = code.replace(
  'if (tabToRender === "ig")\n            return (\n              <IGCard',
  'if (tabToRender === "th")\n            return (\n              <THCard\n                key={item.id}\n                item={item}\n                onStar={props.onStar}\n                onCopy={props.onCopy}\n                onClick={props.onClick}\n                onDelete={props.onDelete}\n              />\n            );\n          if (tabToRender === "ig")\n            return (\n              <IGCard'
);

fs.writeFileSync('src/App.tsx', code);
