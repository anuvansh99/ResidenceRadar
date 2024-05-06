// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "residenceradar.firebaseapp.com",
  projectId: "residenceradar",
  storageBucket: "residenceradar.appspot.com",
  messagingSenderId: "26987514704",
  appId: "1:26987514704:web:49c5765b05c85ec035fa55"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);