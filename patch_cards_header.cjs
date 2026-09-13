const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const lpTarget = `<div className="flex flex-col">
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "LinkedIn Post" ? item.title : "LinkedIn Post"}
            </span>
            {item.title && item.title !== "LinkedIn Post" && <span className="text-[10px] font-medium text-[#b2b8bd] uppercase tracking-wider">LinkedIn Post</span>}
          </div>`;

const lpReplace = `<div className="flex flex-col">
            {item.heading && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[200px]">
                {item.heading}
              </span>
            )}
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "LinkedIn Post" ? item.title : (item.heading ? "" : "LinkedIn Post")}
            </span>
          </div>`;

code = code.replace(lpTarget, lpReplace);

const igTarget = `<div className="flex flex-col">
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "Instagram Post" ? item.title : "Instagram Post"}
            </span>
            {item.title && item.title !== "Instagram Post" && <span className="text-[10px] font-medium text-[#b2b8bd] uppercase tracking-wider">Instagram Post</span>}
          </div>`;

const igReplace = `<div className="flex flex-col">
            {item.heading && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[200px]">
                {item.heading}
              </span>
            )}
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "Instagram Post" ? item.title : (item.heading ? "" : "Instagram Post")}
            </span>
          </div>`;

code = code.replace(igTarget, igReplace);

fs.writeFileSync('src/components/Cards.tsx', code);
