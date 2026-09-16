const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /const t = classifyUrl\(url\) \|\| \(view === "admin" \? adminTab : currentTab\);/,
  'const t = (classifyUrl(url) || (view === "admin" && adminTab !== "analytics" ? adminTab : currentTab)) as ItemType;'
);
content = content.replace(/addItem\(adminTab,/g, 'addItem(adminTab as ItemType,');
content = content.replace(/addItem\(t,/g, 'addItem(t as ItemType,');
content = content.replace(/setCurrentTab\(t\)/g, 'setCurrentTab(t as ItemType)');
content = content.replace(/setAdminTab\(t\)/g, 'setAdminTab(t as ItemType)');
content = content.replace(/addItem\(adminTab,/g, 'addItem(adminTab as ItemType,');
content = content.replace(/if \(t === "ig" \|\| t === "igp" \|\| t === "th"\)/g, 'if (t === "ig" || t === "igp" || t === "th")');
// wait, line 634: "} else if (t === "ig" || t === "igp" || t === "th") {"
fs.writeFileSync('src/App.tsx', content);
