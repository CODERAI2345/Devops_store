const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// 1. Add motion import if not present
if (!content.includes(`import { motion } from "motion/react";`)) {
  content = content.replace(/import React, { useState } from 'react';/, `import React, { useState } from 'react';\nimport { motion } from "motion/react";`);
}

// 2. Add FadeIn component at the top (after imports and domains array)
const fadeInComponent = `
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
`;

if (!content.includes('function FadeIn(')) {
    content = content.replace(/export function LandingPage\(\) \{/, fadeInComponent + '\nexport function LandingPage() {');
}


// 3. Regex to replace <section...> with <section...><FadeIn>
// and </section> with </FadeIn></section>
// We have to be careful with nested sections or just use a simple regex for top level sections.
// Better to manually replace each section's first div.
content = content.replace(
  /<section className="relative overflow-hidden">/g, 
  '<section className="relative overflow-hidden">\n        <FadeIn>'
);
content = content.replace(
  /<\/section>/g,
  '</FadeIn>\n      </section>'
);

// We need to be careful with sections that have IDs or different classes.
// Actually, it's safer to just replace `<section` with `<section` and then wrap its content.
// A more robust way:
