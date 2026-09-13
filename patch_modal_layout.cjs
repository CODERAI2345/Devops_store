const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `      <div
        className="bg-[#0a0a0a] rounded-3xl w-full max-w-[640px] max-h-[88vh] overflow-hidden flex flex-col relative shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_120px_rgba(16,185,129,0.05)] border border-white/10 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />`;

const replaceStr = `      <div
        className="bg-[#0a0a0a] rounded-3xl w-full max-w-[1024px] max-h-[88vh] overflow-hidden flex flex-col md:flex-row relative shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_120px_rgba(16,185,129,0.05)] border border-white/10 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-0" />`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Modal.tsx', code);
