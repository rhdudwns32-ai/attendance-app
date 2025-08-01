// Firebase 초기화 예시 (테스트용 프로젝트)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-EXAMPLE-KEY",
  authDomain: "attendance-demo.firebaseapp.com",
  projectId: "attendance-demo",
  storageBucket: "attendance-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
