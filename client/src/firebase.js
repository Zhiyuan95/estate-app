// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-app-743c3.firebaseapp.com",
  projectId: "estate-app-743c3",
  storageBucket: "estate-app-743c3.appspot.com",
  messagingSenderId: "466090801662",
  appId: "1:466090801662:web:76892d76ba61b8d58528af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
