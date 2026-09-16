const fs = require('fs');

function patchModal(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Revert the massive width classes, keep the premium styling but constrain to 420px
  content = content.replace(
    /className="relative w-full max-w-2xl max-h-\[90vh\] bg-\[\#060816\] border border-white\/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 sm:max-w-\[600px\] xl:max-w-\[700px\] z-10 overflow-hidden"/,
    'className="relative w-full max-w-[420px] max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden"'
  );
  
  fs.writeFileSync(file, content);
}

patchModal('src/components/InstagramModal.tsx');
patchModal('src/components/ThreadsModal.tsx');
console.log('Modals resized to small mobile width.');
