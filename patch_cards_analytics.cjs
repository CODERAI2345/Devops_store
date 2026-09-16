const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

if (!code.includes('logAnalyticsEvent')) {
    code = code.replace(
        'import { PlayCircle, Bookmark, Linkedin, Github, FileText, Mail, Heart, Twitter, Instagram, Copy } from "lucide-react";',
        'import { PlayCircle, Bookmark, Linkedin, Github, FileText, Mail, Heart, Twitter, Instagram, Copy } from "lucide-react";\nimport { logAnalyticsEvent } from "../analytics";'
    );
}

// Search for onClick handlers to add tracking
// We can track copy, heart clicks, and card clicks

// Track Star/Like clicks
code = code.replaceAll(
    'onClick={handleStarClick}',
    'onClick={(e) => {\n            logAnalyticsEvent("like", { itemId: item.id?.toString(), itemTitle: item.title, category: item.type });\n            handleStarClick(e);\n        }}'
);

// Track Copy clicks
code = code.replaceAll(
    'onClick={handleCopy}',
    'onClick={(e) => {\n            logAnalyticsEvent("copy", { itemId: item.id?.toString(), itemTitle: item.title, category: item.type });\n            handleCopy(e);\n        }}'
);

// Track main card clicks
const cardComponents = ['YTCard', 'YSCard', 'YPLCard', 'LICard', 'LPCard', 'BlogCard', 'EmailCard', 'TWCard', 'GitCard', 'IGCard', 'THCard'];

for (const c of cardComponents) {
    const fnDef = `export function ${c}({ item, onClick, viewMode = "card" }: { item: any; onClick?: () => void; viewMode?: "card" | "list" }) {`;
    const newFnDef = `export function ${c}({ item, onClick, viewMode = "card" }: { item: any; onClick?: () => void; viewMode?: "card" | "list" }) {\n  const handleClick = () => {\n    logAnalyticsEvent("view", { itemId: item.id?.toString(), itemTitle: item.title, category: item.type });\n    onClick && onClick();\n  };`;
    
    // Check if it's there
    if (code.includes(fnDef)) {
        code = code.replace(fnDef, newFnDef);
        
        // Find the main onClick={onClick} and replace it with onClick={handleClick}
        // Need to be careful because there are multiple onClicks. The main container is usually the first one or we can just replace the first `onClick={onClick}` inside this component.
    }
}
// Actually replacing `onClick={onClick}` in the entire file is safer for the main wrapper.
code = code.replaceAll('onClick={onClick}', 'onClick={handleClick}');

fs.writeFileSync('src/components/Cards.tsx', code);
