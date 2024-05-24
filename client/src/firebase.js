// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-7b975.firebaseapp.com",
  projectId: "mern-blog-7b975",
  storageBucket: "mern-blog-7b975.appspot.com",
  messagingSenderId: "956043427585",
  appId: "1:956043427585:web:3b5ea59a88539aced3e500"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

