const fs = require('fs');

// --- LANDING PAGE ---
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add Staggered components
const staggerComponents = `
function StaggerContainer({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: delay } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
`;
if (!lp.includes('StaggerContainer')) {
  lp = lp.replace('export default function LandingPage', staggerComponents + '\nexport default function LandingPage');
}

// Hero background pulse
lp = lp.replace(
  'h-[600px] w-full bg-[radial-gradient',
  'h-[600px] w-full animate-[pulse_6s_ease-in-out_infinite] bg-[radial-gradient'
);

// Hero CTA background pulse
lp = lp.replace(
  'bg-orange-500/20 blur-3xl"',
  'bg-orange-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]"'
);
lp = lp.replace(
  'bg-purple-500/20 blur-3xl"',
  'bg-purple-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]"'
);

// Hero Text Staggering
// We replace the container of the text with a StaggerContainer
lp = lp.replace(
  /<div>\s*<div className="mb-7 inline-flex items-center/g,
  '<StaggerContainer>\n            <StaggerItem className="mb-7 inline-flex items-center'
);
lp = lp.replace(
  /Your Hub for Learning, Building, and Sharing\s*<\/div>/g,
  'Your Hub for Learning, Building, and Sharing\n            </StaggerItem>'
);

lp = lp.replace(
  /<h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">/g,
  '<StaggerItem className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">'
);
lp = lp.replace(
  /Learn, Build, Share.\s*<\/span>\s*<\/h2>/g,
  'Learn, Build, Share.\n              </span>\n            </StaggerItem>'
);

lp = lp.replace(
  /<p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">/g,
  '<StaggerItem className="mt-7 max-w-xl text-lg leading-8 text-slate-300" as="p">' // Wait StaggerItem renders div, we can just let it be a div wrapper, but let's replace <p> with <StaggerItem><p>
);
// Actually, let's carefully wrap the paragraph
lp = lp.replace(
  /<p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">([\s\S]*?)<\/p>/,
  '<StaggerItem>\n              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">$1</p>\n            </StaggerItem>'
);

lp = lp.replace(
  /<div className="mt-9 flex flex-wrap gap-4">/g,
  '<StaggerItem>\n              <div className="mt-9 flex flex-wrap gap-4">'
);
lp = lp.replace(
  /Browse Resources <ArrowRight size=\{18\} \/>\s*<\/button>\s*<\/div>/g,
  'Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />\n              </button>\n              </div>\n            </StaggerItem>\n          </StaggerContainer>'
);

// Add 'group' to hero button
lp = lp.replace(
  'hover:-translate-y-1 hover:bg-orange-400"',
  'group hover:-translate-y-1 hover:bg-orange-400"'
);

// Why DevOps Store Cards Staggering
lp = lp.replace(
  /<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">/,
  '<StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">'
);
lp = lp.replace(
  /\{features\.map\(\(feature, i\) => \(/g,
  '{features.map((feature, i) => (\n            <StaggerItem key={i}>'
);
lp = lp.replace(
  /key=\{i\}\s*className="relative flex flex-col rounded-2xl border border-white\/5 bg-white\/\[0\.02\] p-8 transition hover:bg-white\/\[0\.04\]"/g,
  'className="group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/30 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"'
);
lp = lp.replace(
  /<p className="text-sm leading-relaxed text-slate-400">\{feature\.description\}<\/p>\s*<\/div>\s*\)\)}/g,
  '<p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>\n              </div>\n            </StaggerItem>\n          ))}'
);
lp = lp.replace(
  /<\/div>\s*<\/FadeIn>\s*<\/section>\s*\{\/\* ================= DOMAINS/g,
  '</StaggerContainer>\n        </FadeIn>\n      </section>\n      {/* ================= DOMAINS'
);


// Domains Hover Interactivity
lp = lp.replace(
  /className="flex cursor-pointer items-center justify-between rounded-xl border border-white\/5 bg-white\/\[0\.02\] p-4 transition hover:bg-white\/\[0\.04\]"/g,
  'className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"'
);
lp = lp.replace(
  /<ArrowRight size=\{16\} className="text-slate-600" \/>/g,
  '<ArrowRight size={16} className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />'
);

fs.writeFileSync('src/components/LandingPage.tsx', lp);

// --- DEVOPS ANIMATIONS ---
let da = fs.readFileSync('src/components/DevOpsAnimations.tsx', 'utf8');

// Terminal Typing Effect
if (!da.includes('Terminal = () => {')) {
  console.error("Terminal component not found");
} else {
  // Replace Terminal component
  const newTerminal = `
export const Terminal = () => {
  const lines = [
    { text: "kops create cluster --zones=us-east-1c useast1.dev.k8s.local", type: 'cmd' },
    { text: "I0906 14:14:32.181284 1234 create_cluster.go:123] Using SSH public key", type: 'out' },
    { text: "I0906 14:14:33.204592 1234 subnets.go:184] Assigned CIDR 172.20.32.0/19", type: 'out' },
    { text: "Cluster is created.", type: 'success' },
    { text: "kubectl get nodes", type: 'cmd' },
    { text: "NAME               STATUS   ROLES    AGE   VERSION", type: 'out' },
    { text: "ip-172-20-35-1.ec2 Ready    master   2m    v1.27.3", type: 'out' },
    { text: "ip-172-20-40-2.ec2 Ready    node     1m    v1.27.3", type: 'out' },
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      currentLine++;
      setVisibleLines(currentLine);
      if (currentLine >= lines.length) {
        clearInterval(interval);
      }
    }, 600); // 600ms per line
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] shadow-2xl relative">
      <div className="flex h-8 w-full items-center gap-1.5 border-b border-white/10 bg-[#12182b] px-4">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <div className="ml-2 text-[10px] text-slate-500 font-mono">bash - admin@devops-store</div>
      </div>
      <div className="p-4 font-mono text-[11px] leading-relaxed">
        {lines.map((line, i) => {
          if (i >= visibleLines) return null;
          return (
            <motion.div 
              key={i} 
              className="mb-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {line.type === 'cmd' ? (
                <span className="text-slate-300">
                  <span className="text-green-400 mr-2">$</span>
                  {line.text}
                </span>
              ) : line.type === 'success' ? (
                <span className="text-green-400 font-semibold">{line.text}</span>
              ) : (
                <span className="text-slate-500">{line.text}</span>
              )}
            </motion.div>
          );
        })}
        {visibleLines < lines.length && (
           <motion.span 
             animate={{ opacity: [1, 0] }} 
             transition={{ repeat: Infinity, duration: 0.8 }} 
             className="inline-block w-2 h-3 bg-slate-400 ml-1 translate-y-[2px]" 
           />
        )}
      </div>
    </div>
  );
};
`;

  // We need to replace the entire Terminal component
  // Using a robust regex or string manipulation
  let startIndex = da.indexOf('export const Terminal = () => {');
  let nextComponentIndex = da.indexOf('export const K8sPods = () => {');
  if (startIndex !== -1 && nextComponentIndex !== -1) {
    da = da.substring(0, startIndex) + newTerminal + '\n// =====================================================================\n// 2) K8S PODS SCALING ANIMATION\n// =====================================================================\n' + da.substring(nextComponentIndex);
  }
}

// Subtly animate the "Live" badges by pulsing the text color or opacity
da = da.replace(
  /className="flex items-center gap-1\.5 rounded-full bg-blue-500\/10 px-2\.5 py-1 text-\[10px\] font-bold text-blue-400 border border-blue-500\/20"/g,
  'className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20 animate-pulse"'
);
da = da.replace(
  /className="flex items-center gap-1\.5 rounded-full bg-green-500\/10 px-2\.5 py-1 text-\[10px\] font-bold text-green-400 border border-green-500\/20"/g,
  'className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold text-green-400 border border-green-500/20 animate-pulse"'
);
da = da.replace(
  /className="flex items-center gap-1\.5 rounded-full bg-purple-500\/10 px-2\.5 py-1 text-\[10px\] font-bold text-purple-400 border border-purple-500\/20"/g,
  'className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/20 animate-pulse"'
);

fs.writeFileSync('src/components/DevOpsAnimations.tsx', da);

