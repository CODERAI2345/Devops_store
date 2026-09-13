const fs = require('fs');
let code = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

code = code.replace(
  '  onUpdate: (id: number | string, updates: Partial<HubItem>) => void;',
  '  onUpdate: (id: number | string, updates: Partial<HubItem>) => void;\n  defaultEditing?: boolean;'
);

code = code.replace(
  '  onUpdate,\n}: ModalProps) {',
  '  onUpdate,\n  defaultEditing = false,\n}: ModalProps) {'
);

code = code.replace(
  '      setIsEditing(false);',
  '      setIsEditing(defaultEditing);'
);

fs.writeFileSync('src/components/Modal.tsx', code);
