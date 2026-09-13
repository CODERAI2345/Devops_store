import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const id = Date.now();
const item = {
  id,
  type: "ypl",
  url: "https://youtube.com/playlist?list=PLdpzxOOAlwvIcxgCUyBHVOcWs0Krjx9xR",
  ts: id,
  title: "Azure Zero to Hero"
};

async function add() {
  await setDoc(doc(db, "public_items", id.toString()), item);
  console.log("Added successfully!");
  process.exit(0);
}
add();
