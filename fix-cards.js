import fs from 'fs';

let code = fs.readFileSync('src/components/Cards.tsx', 'utf8');

const observerHook = `
function useInView() {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
`;

if (!code.includes('useInView')) {
  // insert before LPCard
  code = code.replace('export function LPCard', observerHook + '\nexport function LPCard');
}

// update LPCard
code = code.replace(
  'const [showEmbed, setShowEmbed] = React.useState(true);',
  'const [showEmbed, setShowEmbed] = React.useState(true);\n  const { ref, inView } = useInView();'
);

code = code.replace(
  '<div\n      className="group h-[500px] flex flex-col relative overflow-hidden rounded-[20px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 backdrop-blur-xl"\n      onClick={onClick}\n    >',
  '<div\n      ref={ref}\n      className="group h-[500px] flex flex-col relative overflow-hidden rounded-[20px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 backdrop-blur-xl"\n      onClick={onClick}\n    >'
);

code = code.replace(
  '{embedUrl && showEmbed ? (',
  '{embedUrl && showEmbed && inView ? ('
);

fs.writeFileSync('src/components/Cards.tsx', code);
