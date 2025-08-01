// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm7Hgy_HhJbSvSD-flQg3nFjhA_e7G7ec",
  authDomain: "gymcheck-b9bbd.firebaseapp.com",
  projectId: "gymcheck-b9bbd",
  storageBucket: "gymcheck-b9bbd.firebasestorage.app",
  messagingSenderId: "1027153387053",
  appId: "1:1027153387053:web:8efc17e4dbe549c5ca22a4",
  measurementId: "G-06SBVRWPNS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
