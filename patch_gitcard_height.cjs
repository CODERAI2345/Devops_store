const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

code = code.replace(
  'className="group h-[500px] relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col"',
  'className="group h-full relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col"'
);

fs.writeFileSync('src/components/Cards.tsx', code);
