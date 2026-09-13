const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `                {(item.type === "lp" || item.type === "tw") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : "Heading"}
                    </label>`;

const replaceStr = `                {(item.type === "lp" || item.type === "tw" || item.type === "ys" || item.type === "yt") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : "Heading"}
                    </label>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/Modal.tsx', code);
