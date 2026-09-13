import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const id = Date.now();
const item = {
  id,
  type: "ypl",
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

const docUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/public_items/${id}?key=${firebaseConfig.apiKey}`;

const fields = {};
for (const [k, v] of Object.entries(item)) {
  if (typeof v === "string") fields[k] = { stringValue: v };
  else if (typeof v === "number") fields[k] = { integerValue: v };
  else if (typeof v === "boolean") fields[k] = { booleanValue: v };
  else if (Array.isArray(v)) fields[k] = { arrayValue: { values: v.map(x => ({ stringValue: x })) } };
}

fetch(docUrl, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fields })
}).then(r => r.json()).then(console.log).catch(console.error);
