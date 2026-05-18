import "dotenv/config";
import admin, { adminAuth, adminDb } from "../src/lib/firebase-admin";

console.log("--------------------------------------------------");
console.log("🔥 Verification: Testing Firebase Admin SDK 🔥");
console.log("--------------------------------------------------");

async function verifyAdmin() {
  try {
    if (admin && admin.apps.length > 0) {
      console.log("✅ Success: Firebase Admin App initialized successfully!");
      
      if (adminAuth) {
        console.log("✅ Success: Firebase Admin Auth Service is operational!");
      }
      
      if (adminDb) {
        console.log("✅ Success: Firebase Admin Firestore Database is operational!");
        
        // Live verification: Try to read/write a lightweight verification ping
        console.log("⚡ Pinging cloud Firestore database...");
        const docRef = adminDb.collection("safeed_verifications").doc("ping");
        
        await docRef.set({
          status: "connected",
          timestamp: new Date(),
          verifiedBy: "Safeed Foods Admin SDK"
        });
        
        const doc = await docRef.get();
        if (doc.exists) {
          console.log("✅ Success: Live read/write ping verified! Cloud database responded with:", doc.data());
        } else {
          console.log("❌ Error: Verification document created but failed to retrieve.");
        }
      }
    } else {
      console.log("❌ Error: Firebase Admin App failed to initialize.");
    }
  } catch (error) {
    console.error("❌ Exception occurred during Firebase Admin verification:", error);
    console.log("💡 Tip: Make sure you have enabled the Firestore Database in your Firebase Console at https://console.firebase.google.com");
  }
  
  console.log("--------------------------------------------------");
}

verifyAdmin();
