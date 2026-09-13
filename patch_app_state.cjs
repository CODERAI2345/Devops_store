const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);',
  'const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);\n  const [modalDefaultEditing, setModalDefaultEditing] = useState(false);'
);

fs.writeFileSync('src/App.tsx', code);
