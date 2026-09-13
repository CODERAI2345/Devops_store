const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const targetStr = `        ) : item.type === "ig" && item.shortcode ? (
          <div className="w-full flex justify-center bg-white p-4">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={\`https://www.instagram.com/p/\${item.shortcode}/?utm_source=ig_embed\`}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '3px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px',
                maxWidth: '540px',
                minWidth: '326px',
                padding: 0,
                width: 'calc(100% - 2px)'
              }}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                )}
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111' }}>{item.title}</h3>
                {item.description && <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}
                <a href={\`https://www.instagram.com/p/\${item.shortcode}/?utm_source=ig_embed\`} style={{ background: '#0095f6', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }} target="_blank">
                  View on Instagram
                </a>
              </div>
            </blockquote>
          </div>`;

const replacementStr = `        ) : item.type === "ig" && item.shortcode ? (
          <div className="w-full h-full min-h-[500px] flex justify-center bg-black overflow-hidden relative">
             <iframe
               src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="yes"
               allowTransparency={true}
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             ></iframe>
          </div>`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/Modal.tsx', code);
