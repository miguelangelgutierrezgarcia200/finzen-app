import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCst_6nnnFHeIUZSnfN5f0YTWsnx1Cz1Kk",
  authDomain: "finzen-f4ab3.firebaseapp.com",
  projectId: "finzen-f4ab3",
  storageBucket: "finzen-f4ab3.firebasestorage.app",
  messagingSenderId: "727520341113",
  appId: "1:727520341113:web:6c5ba17ebbe466fb5ab8a8",
  measurementId: "G-4D3MD5G9JG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();