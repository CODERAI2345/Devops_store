const fs = require('fs');
let da = fs.readFileSync('src/components/DevOpsAnimations.tsx', 'utf8');

if (!da.includes('import { useInView }')) {
  da = da.replace(
    'import { motion } from "motion/react";',
    'import { motion, useInView } from "motion/react";\nimport { useRef } from "react";'
  );
}

// In Terminal component, add useRef and useInView
da = da.replace(
  'const [visibleLines, setVisibleLines] = useState<number>(0);',
  'const [visibleLines, setVisibleLines] = useState<number>(0);\n  const ref = useRef(null);\n  const isInView = useInView(ref, { once: true, margin: "-50px" });'
);

da = da.replace(
  /useEffect\(\(\) => \{\n    let currentLine = 0;\n    const interval = setInterval/g,
  'useEffect(() => {\n    if (!isInView) return;\n    let currentLine = 0;\n    const interval = setInterval'
);
da = da.replace(
  'return () => clearInterval(interval);\n  }, []);',
  'return () => clearInterval(interval);\n  }, [isInView]);'
);

da = da.replace(
  '<div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] shadow-2xl relative">',
  '<div ref={ref} className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] shadow-2xl relative">'
);

fs.writeFileSync('src/components/DevOpsAnimations.tsx', da);
