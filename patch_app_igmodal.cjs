const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import if not present
if (!code.includes('InstagramModal')) {
    code = code.replace(
        'import { Modal } from "./components/Modal";',
        'import { Modal } from "./components/Modal";\nimport { InstagramModal } from "./components/InstagramModal";'
    );
}

// Replace the modal rendering for the feed view (and admin view)
// Let's find both Modal occurrences in App.tsx
const renderModal1 = `<Modal
        item={selectedItem}
        isAdmin={true}
        defaultEditing={modalDefaultEditing}
        onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}`;

const renderIGModal1 = `{selectedItem?.type === "ig" ? (
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
        <Modal
          item={selectedItem}
          isAdmin={true}
          defaultEditing={modalDefaultEditing}
          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}`;

const renderModal2 = `<Modal
        item={selectedItem}
        defaultEditing={modalDefaultEditing}
        onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}`;

const renderIGModal2 = `{selectedItem?.type === "ig" ? (
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
        <Modal
          item={selectedItem}
          defaultEditing={modalDefaultEditing}
          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}`;

if (code.includes(renderModal1)) {
    // Only replace the opening part, the rest of Modal's props will stay the same and just close with )} at the end?
    // Wait, replacing just the top part means the regular Modal tag won't be closed properly by the generic replace.
    // Let's do a regex replacement for the entire Modal component block.
}
