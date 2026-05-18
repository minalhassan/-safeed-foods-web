import "dotenv/config";
import app, { auth } from "../src/lib/firebase";

console.log("--------------------------------------------------");
console.log("🔥 Verification: Testing Firebase Initialization 🔥");
console.log("--------------------------------------------------");

try {
  if (app) {
    console.log("✅ Success: Firebase App initialized successfully!");
    console.log(`📌 App Name: "${app.name}"`);
    console.log(`📌 Project ID: "${app.options.projectId}"`);
    console.log(`📌 Storage Bucket: "${app.options.storageBucket}"`);
    
    if (auth) {
      console.log("✅ Success: Firebase Auth Service initialized successfully!");
    } else {
      console.log("❌ Error: Firebase Auth failed to initialize.");
    }
  } else {
    console.log("❌ Error: Firebase App failed to initialize.");
  }
} catch (error) {
  console.error("❌ Exception occurred during Firebase initialization:", error);
}

console.log("--------------------------------------------------");
