const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const lazyIframeCode = `
export function LazyIframe({ src, title, className, ...props }: any) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Pre-load slightly before it comes into view
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={\`relative w-full h-full \${className || ""}\`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1d2226] flex flex-col items-center justify-center gap-4 animate-pulse">
           <div className="w-12 h-12 rounded-full bg-[#38434f]"></div>
           <div className="w-3/4 h-4 rounded bg-[#38434f]"></div>
           <div className="w-1/2 h-4 rounded bg-[#38434f]"></div>
        </div>
      )}
      {isVisible && (
        <iframe
          src={src}
          title={title}
          onLoad={() => setIsLoaded(true)}
          className={\`w-full h-full absolute inset-0 transition-opacity duration-500 \${isLoaded ? 'opacity-100' : 'opacity-0'}\`}
          {...props}
        />
      )}
    </div>
  );
}
`;

// Insert LazyIframe just after imports and interfaces, before YTCard
code = code.replace('export function YTCard', lazyIframeCode + '\nexport function YTCard');

// Update LPCard
const lpTarget = `<iframe loading="lazy"
             src={embedUrl}
             height="100%"
             width="100%"
             frameBorder="0"
             allowFullScreen
             title="Embedded post"
             className="w-full h-full absolute inset-0 bg-[#1d2226]"
             style={{ overflowY: 'auto' }}
           />`;

const lpReplace = `<LazyIframe
             src={embedUrl}
             height="100%"
             width="100%"
             frameBorder="0"
             allowFullScreen
             title="Embedded post"
             className="w-full h-full absolute inset-0 bg-[#1d2226]"
             style={{ overflowY: 'auto' }}
           />`;
code = code.replace(lpTarget, lpReplace);

// Update IGCard
const igTarget = `<iframe
               src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="no"
               allowtransparency="true"
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             ></iframe>`;

const igReplace = `<LazyIframe
               src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="no"
               allowtransparency="true"
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             />`;
code = code.replace(igTarget, igReplace);

fs.writeFileSync('src/components/Cards.tsx', code);
