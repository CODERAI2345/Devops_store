const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const targetStr = `        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Short"}
        </h3>
      </div>
    </div>`;

const replaceStr = `        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Short"}
        </h3>
        {item.author && (
           <div className="text-xs text-white/50 mt-auto pt-3">
             {item.author}
           </div>
        )}
      </div>
    </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/Cards.tsx', code);
