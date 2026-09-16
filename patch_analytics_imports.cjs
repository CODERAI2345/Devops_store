const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('logAnalyticsEvent')) {
    code = code.replace(
        'import * as XLSX from "xlsx";',
        'import * as XLSX from "xlsx";\nimport { logAnalyticsEvent } from "./analytics";'
    );
}

// Add BarChart to lucide-react imports if not there
if (!code.includes('BarChart')) {
    code = code.replace(
        'Link as LinkIcon,',
        'Link as LinkIcon, BarChart,'
    );
}

fs.writeFileSync('src/App.tsx', code);
