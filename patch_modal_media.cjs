const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `        {(item.type === "yt" || item.type === "ys" || item.type === "ypl") && (item as any).vid ? (
          <iframe
            src={\`https://www.youtube.com/embed/\${(item as any).vid}\`}
            className={\`w-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto mt-12 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "aspect-video"} border-0 bg-black\`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : item.type === "ypl" && (item as any).pid ? (
          <iframe
            src={\`https://www.youtube.com/embed/videoseries?list=\${(item as any).pid}\`}
            className="w-full aspect-video border-0 bg-black"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : item.type === "ig" && item.shortcode ? (
          <div className="w-full h-full min-h-[500px] flex justify-center bg-black overflow-hidden relative">
             <iframe
               src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="yes"
               allowtransparency="true"
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             ></iframe>
          </div>
        ) : thumb ? (
          <img
            src={thumb}
            alt=""
            className={\`w-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover mt-12 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : item.type === "li" || item.type === "lp" ? "max-h-[400px] object-contain bg-[#111]" : "aspect-video object-cover"} bg-[#111]\`}
          />
        ) : null}

        <div className="p-8 overflow-y-auto flex-1 no-scrollbar relative z-10">`;

const replaceStr = `        <div className="w-full md:w-[45%] lg:w-[50%] shrink-0 bg-[#000] relative border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center min-h-[40vh] md:min-h-0 overflow-y-auto custom-scrollbar">
          {(item.type === "yt" || item.type === "ys" || item.type === "ypl") && (item as any).vid ? (
            <iframe
              src={\`https://www.youtube.com/embed/\${(item as any).vid}\`}
              className={\`w-full h-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto mt-4 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "aspect-video"} border-0 bg-black\`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : item.type === "ypl" && (item as any).pid ? (
            <iframe
              src={\`https://www.youtube.com/embed/videoseries?list=\${(item as any).pid}\`}
              className="w-full h-full aspect-video border-0 bg-black"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : item.type === "ig" && item.shortcode ? (
            <div className="w-full h-full md:min-h-[600px] min-h-[400px] flex justify-center bg-black overflow-hidden relative">
               <iframe
                 src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
                 width="100%"
                 height="100%"
                 frameBorder="0"
                 scrolling="yes"
                 allowtransparency="true"
                 allow="encrypted-media"
                 className="w-full h-full absolute inset-0 bg-white"
               ></iframe>
            </div>
          ) : thumb ? (
            <img
              src={thumb}
              alt=""
              className={\`w-full h-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover mt-4 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : item.type === "li" || item.type === "lp" ? "object-contain bg-[#000]" : "aspect-video object-cover"} bg-[#000]\`}
            />
          ) : (
            <div className="w-full h-full min-h-[300px] flex items-center justify-center text-white/20">No Preview Available</div>
          )}
        </div>

        <div className="p-8 md:p-10 overflow-y-auto flex-1 custom-scrollbar relative z-10 bg-[#0a0a0a]">`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Modal.tsx', code);
