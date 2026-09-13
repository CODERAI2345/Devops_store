const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

const oldFallback = `              <div style={{ padding: '16px' }}>
                <a href={\`https://www.instagram.com/p/\${item.shortcode}/?utm_source=ig_embed\`} style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }} target="_blank">
                  View this post on Instagram
                </a>
              </div>`;
              
const newFallback = `              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                )}
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111' }}>{item.title}</h3>
                {item.description && <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}
                <a href={\`https://www.instagram.com/p/\${item.shortcode}/?utm_source=ig_embed\`} style={{ background: '#0095f6', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }} target="_blank">
                  View on Instagram
                </a>
              </div>`;

code = code.replace(oldFallback, newFallback);
fs.writeFileSync('src/components/Modal.tsx', code);
