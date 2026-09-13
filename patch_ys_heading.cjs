const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const targetStr = `        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Short"}
        </h3>`;

const replaceStr = `        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Short"}
        </h3>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/Cards.tsx', code);
