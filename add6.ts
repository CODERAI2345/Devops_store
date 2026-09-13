import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const id = Date.now();
const item = {
  id,
  type: "yt",
  url: "https://youtube.com/playlist?list=PLdpzxOOAlwvIcxgCUyBHVOcWs0Krjx9xR&si=wFvL7dN1WB1yygG2",
  date: new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
  ts: id,
  title: "Azure Zero to Hero",
  author: "Abhishek.Veeramalla",
  thumbnail: "https://i.ytimg.com/vi/10jm7Waan8M/hqdefault.jpg",
  description: "",
  tags: [],
  starred: false,
  company: "",
  location: "",
  role: "",
  platform: "",
  pid: "PLdpzxOOAlwvIcxgCUyBHVOcWs0Krjx9xR",
  count: 0
};

async function add() {
  await setDoc(doc(db, "public_items", id.toString()), item);
  console.log("Added successfully!");
  process.exit(0);
}
add();
