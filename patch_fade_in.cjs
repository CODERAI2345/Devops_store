const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

if (!content.includes(`import { motion } from "motion/react";`)) {
  content = content.replace(/import React, { useState } from 'react';/, `import React, { useState } from 'react';\nimport { motion } from "motion/react";`);
}

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

// Replace each section with a wrapped version.
// Find all <section ...> ... </section>
// We can use a regex that matches `<section[^>]*>` and `</section>`
// But since there might be nested sections, we should be careful. There are no nested sections in LandingPage.
content = content.replace(/(<section[^>]*>)/g, '$1\n        <FadeIn>');
content = content.replace(/<\/section>/g, '        </FadeIn>\n      </section>');

fs.writeFileSync('src/components/LandingPage.tsx', content);
