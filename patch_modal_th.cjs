const fs = require('fs');
let code = fs.readFileSync('src/components/ThreadsModal.tsx', 'utf-8');

// Replace sizing and styling
code = code.replace('max-w-[540px]', 'max-w-[400px]');
code = code.replace('rounded-xl overflow-hidden shadow-2xl max-h-[80vh]', 'rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-h-[85vh]');
code = code.replace('min-h-[600px]', 'min-h-[480px] max-h-[550px]');

// Replace header container styling
code = code.replace('px-4 py-3 shrink-0 z-20 mb-2', 'px-5 py-4 shrink-0 z-20');
code = code.replace('bg-black/90 backdrop-blur-md', 'bg-black/60 backdrop-blur-xl');

// Footer styling
code = code.replace('w-full py-3.5 rounded-xl bg-white text-black', 'w-full py-3 rounded-full bg-white text-black shadow-lg');

fs.writeFileSync('src/components/ThreadsModal.tsx', code);
