import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, initializeFirestore } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

async function check() {
  const snap = await getDocs(collection(db, "public_items"));
  console.log("Total docs:", snap.docs.length);
  snap.docs.forEach((d, i) => {
    if (i < 5) console.log("Doc", d.id, "=> id field:", typeof d.data().id, d.data().id);
  });
  process.exit(0);
}
check().catch(console.error);
