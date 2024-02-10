
import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO3oizzkHM-MsCnQnB85BkrHJsfX0YNRs",
  authDomain: "siginup-react.firebaseapp.com",
  projectId: "siginup-react",
  storageBucket: "siginup-react.appspot.com",
  messagingSenderId: "109864604823",
  appId: "1:109864604823:web:d995b90665bb5a017c45d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);