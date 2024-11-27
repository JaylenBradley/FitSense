import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCVVVUTdPc-1Hn1ynYi9FSwHxmpLmUC7AM",
  authDomain: "fitsense-49348.firebaseapp.com",
  projectId: "fitsense-49348",
  storageBucket: "fitsense-49348.firebasestorage.app",
  messagingSenderId: "496113716665",
  appId: "1:496113716665:web:31cb8a38413e99c77bfa68",
  measurementId: "G-R5H4F1SVNQ"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);