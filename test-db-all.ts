import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, initializeFirestore } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

async function check() {
  const snap = await getDocs(collection(db, "public_items"));
  let missingId = 0;
  let stringId = 0;
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.id === undefined) missingId++;
    if (typeof data.id === "string") stringId++;
    if (d.id !== String(data.id)) {
        console.log("Mismatch:", d.id, "vs", data.id);
    }
  });
  console.log("Total:", snap.docs.length, "Missing:", missingId, "String:", stringId);
  process.exit(0);
}
check().catch(console.error);
