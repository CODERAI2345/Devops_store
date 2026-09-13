const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

// Update LPCard
const lpTarget = `<div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b2b8bd]">
              Post
            </span>
          </div>`;

const lpReplace = `<div className="flex flex-col">
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "LinkedIn Post" ? item.title : "LinkedIn Post"}
            </span>
            {item.title && item.title !== "LinkedIn Post" && <span className="text-[10px] font-medium text-[#b2b8bd] uppercase tracking-wider">LinkedIn Post</span>}
          </div>`;

code = code.replace(lpTarget, lpReplace);

// Update IGCard
const igTarget = `<div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b2b8bd]">
              Instagram Post
            </span>
          </div>`;

const igReplace = `<div className="flex flex-col">
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "Instagram Post" ? item.title : "Instagram Post"}
            </span>
            {item.title && item.title !== "Instagram Post" && <span className="text-[10px] font-medium text-[#b2b8bd] uppercase tracking-wider">Instagram Post</span>}
          </div>`;

code = code.replace(igTarget, igReplace);

fs.writeFileSync('src/components/Cards.tsx', code);
