const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const targetStrYT = `        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Video"}
        </h3>`;

const replaceStrYT = `        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Video"}
        </h3>`;

code = code.replace(targetStrYT, replaceStrYT);

const targetStrYPL = `        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Playlist"}
        </h3>`;

const replaceStrYPL = `        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Playlist"}
        </h3>`;

code = code.replace(targetStrYPL, replaceStrYPL);
fs.writeFileSync('src/components/Cards.tsx', code);
