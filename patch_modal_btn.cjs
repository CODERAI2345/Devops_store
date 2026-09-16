const fs = require('fs');
let content = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

// Replace primary button styling
content = content.replace(
  /className="flex-1 py-3 rounded-xl bg-black\/20 text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 hover:scale-\[1\.02\] shadow-lg shadow-white\/5"/,
  'className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25"'
);

fs.writeFileSync('src/components/Modal.tsx', content);
console.log('Modal button patched.');
