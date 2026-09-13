const admin = require('firebase-admin');
admin.initializeApp({
  projectId: "ai-studio-eeeb7d35-dd40-41d4-9fe3-cf5abc43ee8f"
});
const db = admin.firestore();
db.collection('hub_items').where('type', '==', 'ys').limit(1).get().then(snap => {
  if (snap.empty) {
    console.log("No YS items");
  } else {
    snap.forEach(doc => console.log(doc.data()));
  }
}).catch(console.error);
