import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
    authDomain: "residenceradar.firebaseapp.com",
    projectId: "residenceradar",
    storageBucket: "residenceradar.appspot.com",
    messagingSenderId: "26987514704",
    appId: "1:26987514704:web:49c5765b05c85ec035fa55"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const storage = firebase.storage();