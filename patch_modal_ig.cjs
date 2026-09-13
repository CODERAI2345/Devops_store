const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

// Add global instgrm type
if (!code.includes('declare global')) {
  code = `declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}
` + code;
}

// In useEffect for item, add IG script injection
const useEffectMatch = `useEffect(() => {
    if (item) {
      setEditData(item);
      setIsEditing(false);`;

const useEffectReplacement = `useEffect(() => {
    if (item) {
      setEditData(item);
      setIsEditing(false);
      
      if (item.type === 'ig' && item.shortcode) {
        if (!window.instgrm) {
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => window.instgrm?.Embeds.process();
          document.body.appendChild(script);
        } else {
          setTimeout(() => window.instgrm?.Embeds.process(), 100);
        }
      }
`;
code = code.replace(useEffectMatch, useEffectReplacement);

// Handle the top media area
const mediaMatch = `        ) : thumb ? (
          <img
            src={thumb}
            alt=""
            className={\`w-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover mt-12 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : item.type === "li" || item.type === "lp" ? "max-h-[400px] object-contain bg-[#111]" : "aspect-video object-cover"} bg-[#111]\`}
          />
        ) : null}`;

const mediaReplacement = `        ) : item.type === "ig" && item.shortcode ? (
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
              <div style={{ padding: '16px' }}>
                <a href={\`https://www.instagram.com/p/\${item.shortcode}/?utm_source=ig_embed\`} style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }} target="_blank">
                  View this post on Instagram
                </a>
              </div>
            </blockquote>
          </div>
        ) : thumb ? (
          <img
            src={thumb}
            alt=""
            className={\`w-full \${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover mt-12 mb-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]" : item.type === "li" || item.type === "lp" ? "max-h-[400px] object-contain bg-[#111]" : "aspect-video object-cover"} bg-[#111]\`}
          />
        ) : null}`;

code = code.replace(mediaMatch, mediaReplacement);

// Fix button label
code = code.replace(
    'tw: "Open X / Twitter Post",',
    'tw: "Open X / Twitter Post",\n    ig: "Open on Instagram",'
);

fs.writeFileSync('src/components/Modal.tsx', code);
