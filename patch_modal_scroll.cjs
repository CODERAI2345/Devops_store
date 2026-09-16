const fs = require('fs');
let code = fs.readFileSync('src/components/InstagramModal.tsx', 'utf-8');

const oldModal = `        {/* Content Container */}
        <div className="w-full flex justify-center bg-white rounded-xl overflow-hidden shadow-2xl">
          {!iframeFailed && item.shortcode ? (
            <iframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
              className="w-full min-h-[600px] border-0"
              allow="encrypted-media"
              scrolling="no"
              onError={() => setIframeFailed(true)}
            ></iframe>`;

const newModal = `        {/* Content Container */}
        <div className="w-full flex justify-center bg-white rounded-xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
          {!iframeFailed && item.shortcode ? (
            <iframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed/captioned\`}
              className="w-full min-h-[600px] border-0"
              allow="encrypted-media"
              scrolling="yes"
              onError={() => setIframeFailed(true)}
            ></iframe>`;

code = code.replace(oldModal, newModal);
fs.writeFileSync('src/components/InstagramModal.tsx', code);
