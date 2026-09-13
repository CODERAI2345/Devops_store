const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `                {(item.type === "lp" || item.type === "tw" || item.type === "ys" || item.type === "yt") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : "Heading"}
                    </label>`;

const replaceStr = `                {(item.type === "lp" || item.type === "tw" || item.type === "ys" || item.type === "yt" || item.type === "ig" || item.type === "li") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : "Heading"}
                    </label>`;

code = code.replace(targetStr, replaceStr);

const renderTargetStr = `                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug mb-5 tracking-tight break-words">
                  {(item as any).heading ? (
                    <span className="text-emerald-400 mr-3 inline-block">
                      {(item as any).heading}
                    </span>
                  ) : null}
                  {name}
                </h1>`;
// we don't need to change this if it uses item.heading generically.

fs.writeFileSync('src/components/Modal.tsx', code);
