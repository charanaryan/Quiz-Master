// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6QhmA367JaVcI2BNY3UYYRmuNqe_z8ko",
  authDomain: "auth-4909b.firebaseapp.com",
  projectId: "auth-4909b",
  storageBucket: "auth-4909b.appspot.com",
  messagingSenderId: "168526596529",
  appId: "1:168526596529:web:5b5c77049a7c534a741590",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
