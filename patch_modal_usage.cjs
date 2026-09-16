const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('InstagramModal')) {
    code = code.replace(
        'import { Modal } from "./components/Modal";',
        'import { Modal } from "./components/Modal";\nimport { InstagramModal } from "./components/InstagramModal";'
    );
}

const findMatchingClosingTag = (str, startIndex) => {
    let depth = 0;
    for (let i = startIndex; i < str.length; i++) {
        if (str.slice(i, i + 6) === '<Modal') depth++;
        if (str.slice(i, i + 2) === '/>') {
            depth--;
            if (depth <= 0) return i + 2;
        }
    }
    return -1;
};

// First modal
let idx1 = code.indexOf('<Modal\n          item={selectedItem}\n          isAdmin={true}');
if (idx1 !== -1) {
    let endIdx1 = findMatchingClosingTag(code, idx1);
    let modal1 = code.slice(idx1, endIdx1);
    
    let replacement1 = `{selectedItem?.type === "ig" ? (
        <InstagramModal
          item={selectedItem}
          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}
          onStar={() => {
            if (selectedItem) toggleStar(selectedItem.type, selectedItem.id);
            setSelectedItem((prev) =>
              prev ? { ...prev, starred: !prev.starred } : null,
            );
          }}
          onCopy={() => {
            if (selectedItem) {
              navigator.clipboard.writeText(selectedItem.url);
              showToast("Instagram link copied!");
            }
          }}
        />
      ) : (
        ${modal1.replace(/\n/g, '\n        ')}
      )}`;
      
    code = code.slice(0, idx1) + replacement1 + code.slice(endIdx1);
}

// Second modal
let idx2 = code.indexOf('<Modal\n        item={selectedItem}\n        defaultEditing={modalDefaultEditing}');
if (idx2 !== -1) {
    let endIdx2 = findMatchingClosingTag(code, idx2);
    let modal2 = code.slice(idx2, endIdx2);
    
    let replacement2 = `{selectedItem?.type === "ig" ? (
        <InstagramModal
          item={selectedItem}
          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}
          onStar={() => {
            if (selectedItem) toggleStar(selectedItem.type, selectedItem.id);
            setSelectedItem((prev) =>
              prev ? { ...prev, starred: !prev.starred } : null,
            );
          }}
          onCopy={() => {
            if (selectedItem) {
              navigator.clipboard.writeText(selectedItem.url);
              showToast("Instagram link copied!");
            }
          }}
        />
      ) : (
        ${modal2.replace(/\n/g, '\n        ')}
      )}`;
      
    code = code.slice(0, idx2) + replacement2 + code.slice(endIdx2);
}

fs.writeFileSync('src/App.tsx', code);
