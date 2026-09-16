const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Array of types mapping
code = code.replace(
  '["yt", "ypl", "ys", "lp", "tw", "ig", "th", "blog", "email", "git"]',
  '["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"]'
);

// 2. Icon matching
code = code.replace(
  '{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}',
  '{t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}\n                      {t === "igp" && <Instagram className="w-3.5 h-3.5 text-pink-500" />}'
);

code = code.replace(
  '{t === "ig" && <Instagram className="w-4 h-4 text-pink-400" />}',
  '{t === "ig" && <Instagram className="w-4 h-4 text-pink-400" />}\n                        {t === "igp" && <Instagram className="w-4 h-4 text-pink-500" />}'
);

// 3. Admin Add Link text
code = code.replace(
  'adminTab === "ig" ? "Instagram"',
  'adminTab === "ig" ? "Instagram Reels" : adminTab === "igp" ? "Instagram Post"'
);

// 4. Tab titles
const oldTitleText1 = 't === "ig" ? "Instagram"';
const newTitleText1 = 't === "ig" ? "Instagram Reels" : t === "igp" ? "Instagram Posts"';
code = code.split(oldTitleText1).join(newTitleText1);

const oldHeader = 'currentTab === "ig" ? "Instagram Posts & Reels"';
const newHeader = 'currentTab === "ig" ? "Instagram Reels" : currentTab === "igp" ? "Instagram Posts"';
code = code.split(oldHeader).join(newHeader);

// 5. Card rendering
const oldCardRender = `        {currentTab === "ig" && items.map((item) => (
          <IGCard key={item.id} item={item} onStar={() => toggleStar("ig", item.id)} onCopy={() => copyLink(item.url)} onClick={() => { setSelectedItem(item as any); setModalDefaultEditing(false); }} />
        ))}`;
const newCardRender = `        {currentTab === "ig" && items.map((item) => (
          <IGCard key={item.id} item={item} onStar={() => toggleStar("ig", item.id)} onCopy={() => copyLink(item.url)} onClick={() => { setSelectedItem(item as any); setModalDefaultEditing(false); }} />
        ))}
        {currentTab === "igp" && items.map((item) => (
          <IGCard key={item.id} item={item} onStar={() => toggleStar("igp", item.id)} onCopy={() => copyLink(item.url)} onClick={() => { setSelectedItem(item as any); setModalDefaultEditing(false); }} />
        ))}`;
code = code.split(oldCardRender).join(newCardRender);

// 6. Selected Item check for modal
const oldModalCheck = 'selectedItem?.type === "ig" ? (';
const newModalCheck = '(selectedItem?.type === "ig" || selectedItem?.type === "igp") ? (';
code = code.split(oldModalCheck).join(newModalCheck);

fs.writeFileSync('src/App.tsx', code);
