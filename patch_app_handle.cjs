const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'setAdminTab(t);\n      }\n    } catch (e) {',
  'setAdminTab(t);\n      }\n      if (t === "ig") {\n        setModalDefaultEditing(true);\n        setSelectedItem(item);\n      }\n    } catch (e) {'
);

fs.writeFileSync('src/App.tsx', code);
