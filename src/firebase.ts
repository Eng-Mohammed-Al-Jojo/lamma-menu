/*----*/

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2sbCxojhWC6H6OYrdm0O1ZmT7RTPeLRw",
  authDomain: "lamma-menu.firebaseapp.com",
  databaseURL: "https://lamma-menu-default-rtdb.firebaseio.com",
  projectId: "lamma-menu",
  storageBucket: "lamma-menu.firebasestorage.app",
  messagingSenderId: "279777034561",
  appId: "1:279777034561:web:f7d5f1f4c85382305b21c0"
};
const app = initializeApp(firebaseConfig);

// 👇 هذا هو المهم
export const db = getDatabase(app);
export const auth = getAuth(app);
