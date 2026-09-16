const fs = require('fs');
let code = fs.readFileSync('src/components/InstagramModal.tsx', 'utf-8');

// Replace the scaled iframe container part to fix the layout box size
const oldDiv = `<div 
              style={{
                width: '100%',
                maxWidth: '540px',
                height: iframeHeight,
                transform: \`scale(\${scale})\`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out, height 0.2s ease-out'
              }}
              className="relative flex justify-center items-center"
            >
              <iframe
                src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
                className="w-full h-full border-0 rounded-xl shadow-2xl bg-white"
                allow="encrypted-media"
                scrolling="no"
                onError={() => setIframeFailed(true)}
              ></iframe>
            </div>`;

const newDiv = `<div 
              style={{
                width: 540 * scale,
                height: iframeHeight * scale,
                transition: 'width 0.2s ease-out, height 0.2s ease-out'
              }}
              className="relative flex justify-center items-center"
            >
              <div
                style={{
                  width: 540,
                  height: iframeHeight,
                  transform: \`scale(\${scale})\`,
                  transformOrigin: 'top left',
                }}
                className="absolute top-0 left-0"
              >
                <iframe
                  src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
                  className="w-full h-full border-0 rounded-xl shadow-2xl bg-white"
                  allow="encrypted-media"
                  scrolling="no"
                  onError={() => setIframeFailed(true)}
                ></iframe>
              </div>
            </div>`;

code = code.replace(oldDiv, newDiv);
fs.writeFileSync('src/components/InstagramModal.tsx', code);
