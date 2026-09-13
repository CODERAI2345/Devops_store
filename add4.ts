import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };
const id = Date.now();
const item = {
  id,
  type: "yt",
  url: "https://youtube.com/watch",
  ts: id,
  title: "Test"
};
const docUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/public_items/${id}?key=${firebaseConfig.apiKey}`;
const fields = {};
for (const [k, v] of Object.entries(item)) {
  if (typeof v === "string") fields[k] = { stringValue: v };
  else if (typeof v === "number") fields[k] = { integerValue: v };
}
fetch(docUrl, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fields })
}).then(r => r.json()).then(console.log);
