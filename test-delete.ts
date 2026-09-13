import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, initializeFirestore } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

async function check() {
  const testId = Date.now() + Math.random();
  console.log("Creating doc", testId);
  await setDoc(doc(db, "public_items", testId.toString()), { id: testId, type: "yt", url: "test", title: "test", ts: testId });
  console.log("Created. Now deleting...");
  await deleteDoc(doc(db, "public_items", testId.toString()));
  console.log("Deleted successfully.");
  process.exit(0);
}
check().catch(console.error);
