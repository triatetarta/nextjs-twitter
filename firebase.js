import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD_sGTRXsxJqTglScolibvDnct_Fi8pxc",
  authDomain: "nextjs-twitter-6ce92.firebaseapp.com",
  projectId: "nextjs-twitter-6ce92",
  storageBucket: "nextjs-twitter-6ce92.appspot.com",
  messagingSenderId: "733300630061",
  appId: "1:733300630061:web:3522f280c0bff9daf0cea4",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
