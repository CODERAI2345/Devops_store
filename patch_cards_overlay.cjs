const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const oldIGCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {item.shortcode ? (
            <LazyIframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed/captioned\`}
              title="Instagram embed"
              className="w-full h-full absolute inset-0 bg-white"
            />`;

const newIGCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {/* Transparent overlay to capture clicks and trigger the modal over the iframe */}
         <div className="absolute inset-0 z-10 cursor-pointer" />
         {item.shortcode ? (
            <LazyIframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed/captioned\`}
              title="Instagram embed"
              className="w-full h-full absolute inset-0 bg-white"
            />`;

code = code.replace(oldIGCard, newIGCard);

const oldTHCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {item.shortcode ? (
            <LazyIframe
              src={\`https://www.threads.net/t/\${item.shortcode}/embed\`}
              title="Threads embed"
              className="w-full h-full absolute inset-0 bg-white"
            />`;

const newTHCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {/* Transparent overlay to capture clicks and trigger the modal over the iframe */}
         <div className="absolute inset-0 z-10 cursor-pointer" />
         {item.shortcode ? (
            <LazyIframe
              src={\`https://www.threads.net/t/\${item.shortcode}/embed\`}
              title="Threads embed"
              className="w-full h-full absolute inset-0 bg-white"
            />`;

code = code.replace(oldTHCard, newTHCard);

fs.writeFileSync('src/components/Cards.tsx', code);
