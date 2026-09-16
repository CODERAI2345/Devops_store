const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update tabs array everywhere
content = content.replace(
  /\(\["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git"\] as ItemType\[\]\)/g,
  '(["yt", "ypl", "ys", "lp", "tw", "ig", "igp", "th", "blog", "email", "git", "web", "lab"] as ItemType[])'
);

// Add icons for web and lab in the Sidebar / Mobile Tabs
content = content.replace(
  /\{t === "git" && <Github className="w-4 h-4 text-slate-400" \/>\}/g,
  `{t === "git" && <Github className="w-4 h-4 text-slate-400" />}
                        {t === "web" && <Globe2 className="w-4 h-4 text-blue-400" />}
                        {t === "lab" && <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>}`
);

// Add labels for web and lab
content = content.replace(
  /t === "git" \? "GitHub" : ""/g,
  't === "git" ? "GitHub" : t === "web" ? "Websites" : t === "lab" ? "Labs" : ""'
);

// Add initialization to db state (if it exists like that in App.tsx)
content = content.replace(
  /const \[db, setDb\] = useLocalStorage<HubDB>\("devops_hub_db", \{/,
  'const [db, setDb] = useLocalStorage<HubDB>("devops_hub_db", {\n    web: [],\n    lab: [],'
);

// Also check Admin Modal placeholder texts
content = content.replace(
  /adminTab === "th" \? "Threads" : "Link"/g,
  'adminTab === "th" ? "Threads" : adminTab === "web" ? "Website" : adminTab === "lab" ? "Lab/Course" : "Link"'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx tabs patched.');
