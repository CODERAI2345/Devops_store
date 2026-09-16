const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The original string we want to replace
const originalToastClass = 'className={`fixed bottom-6 right-6 bg-black/20 text-black rounded-xl px-5 py-3 text-sm font-semibold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 z-[999] ${toastMsg ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}';

const newToastClass = 'className={`fixed bottom-6 right-6 bg-[#09090B] border ${toastMsg?.err ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)]"} rounded-xl px-5 py-3 text-sm font-semibold flex items-center gap-3 transition-all duration-300 z-[999] ${toastMsg ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}';

// We also want to replace the text rendering to make it colorful
const originalTextRender = '{toastMsg?.msg}';
const newTextRender = '<span className={toastMsg?.err ? "text-red-400" : "text-fuchsia-100"}>{toastMsg?.msg}</span>';

// Perform replacements
content = content.replaceAll(originalToastClass, newToastClass);
content = content.replaceAll('{toastMsg?.msg}', newTextRender);

fs.writeFileSync('src/App.tsx', content);
console.log('Toasts updated.');
