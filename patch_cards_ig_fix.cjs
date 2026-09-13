const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const targetStr = `            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:text-red-400 hover:bg-[#38434f] shrink-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>`;

code = code.replace(targetStr, '');

const targetStr2 = `             {item.description && item.description !== "Embedded Instagram Content" ? (
                 <p className="text-sm text-white/90 mb-4 whitespace-pre-wrap leading-relaxed">
                     {item.description}
                 </p>
             ) : (
                <p className="text-sm text-orange-400/70 mb-4 whitespace-pre-wrap leading-relaxed flex items-center gap-1">
                   <Edit2 className="w-4 h-4" /> Tap to manually tag this post
                </p>
             )}`;

const replaceStr2 = `             {item.description && item.description !== "Embedded Instagram Content" && (
                 <p className="text-sm text-white/90 mb-4 whitespace-pre-wrap leading-relaxed">
                     {item.description}
                 </p>
             )}`;

code = code.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/components/Cards.tsx', code);
