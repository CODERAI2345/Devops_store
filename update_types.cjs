const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  'export type ItemType = "yt" | "ys" | "ypl" | "lp" | "blog" | "email" | "tw" | "git" | "li";',
  'export type ItemType = "yt" | "ys" | "ypl" | "lp" | "blog" | "email" | "tw" | "git" | "li" | "ig";'
);

const igInterface = `
export interface IGItem extends BaseItem {
  type: "ig";
  shortcode?: string;
  tags?: string[];
}
`;

content = content.replace(
  'export type HubItem = YTItem',
  igInterface + '\nexport type HubItem = IGItem | YTItem'
);

content = content.replace(
  '  git: GitItem[];',
  '  git: GitItem[];\n  ig: IGItem[];'
);

fs.writeFileSync('src/types.ts', content);
