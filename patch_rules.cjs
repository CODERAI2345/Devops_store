const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');

code = code.replace(
  "data.type in ['yt', 'ys', 'li', 'lp', 'job', 'blog', 'email', 'hremail', 'ypl', 'tw', 'git', 'ig', 'th']",
  "data.type in ['yt', 'ys', 'li', 'lp', 'job', 'blog', 'email', 'hremail', 'ypl', 'tw', 'git', 'ig', 'igp', 'th']"
);

fs.writeFileSync('firestore.rules', code);
