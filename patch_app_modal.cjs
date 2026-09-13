const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  '<Modal\n          item={selectedItem}\n          isAdmin={true}\n          onClose={() => setSelectedItem(null)}',
  '<Modal\n          item={selectedItem}\n          isAdmin={true}\n          defaultEditing={modalDefaultEditing}\n          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}'
);

code = code.replace(
  '<Modal\n        item={selectedItem}\n        onClose={() => setSelectedItem(null)}',
  '<Modal\n        item={selectedItem}\n        defaultEditing={modalDefaultEditing}\n        onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}'
);

fs.writeFileSync('src/App.tsx', code);
