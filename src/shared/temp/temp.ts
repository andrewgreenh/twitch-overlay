import admin from "firebase-admin";
import { config } from "../config";

const serviceAccount = config.firebase_service_account;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://andreasgruenh-twitch-overlay.firebaseio.com",
  });
}

const db = admin.firestore();

export const temp = {
  async getOrDefault<T>(key: string, defaultValue: T): Promise<T> {
    const doc = await db.collection("user-data").doc(key).get();
    const data = doc.data() || { content: defaultValue };
    return data.content;
  },

  async save<T>(key: string, value: T): Promise<void> {
    await db.collection("user-data").doc(key).set({ content: value });
  },
};
