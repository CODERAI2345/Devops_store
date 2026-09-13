const fs = require('fs');
let da = fs.readFileSync('src/components/DevOpsAnimations.tsx', 'utf8');

da = da.replace(
  '    </div>\n  );\n\n// =================',
  '    </div>\n  );\n};\n\n// ================='
);

// If it's something else:
da = da.replace(
  '    </div>\n  );\n// =================',
  '    </div>\n  );\n};\n// ================='
);

fs.writeFileSync('src/components/DevOpsAnimations.tsx', da);
