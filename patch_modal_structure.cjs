const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `        <div className="p-8 md:p-10 overflow-y-auto flex-1 custom-scrollbar relative z-10 bg-[#0a0a0a]">`;

const replaceStr = `        <div className="flex-1 flex flex-col relative z-10 bg-[#0a0a0a] min-w-0">
          <div className="p-8 md:p-10 overflow-y-auto flex-1 custom-scrollbar">`;

code = code.replace(targetStr, replaceStr);

const footerTargetStr = `        <div className="p-5 sm:px-8 border-t border-white/10 flex flex-wrap sm:flex-nowrap gap-3 items-center bg-black/40 backdrop-blur-md relative z-10">
          {item.url ? (
            <button
              onClick={handlePrimaryClick}`;

const footerReplaceStr = `        </div>
        <div className="p-5 sm:px-8 border-t border-white/10 flex flex-wrap sm:flex-nowrap gap-3 items-center bg-black/40 backdrop-blur-md shrink-0">
          {item.url ? (
            <button
              onClick={handlePrimaryClick}`;

code = code.replace(footerTargetStr, footerReplaceStr);

fs.writeFileSync('src/components/Modal.tsx', code);
