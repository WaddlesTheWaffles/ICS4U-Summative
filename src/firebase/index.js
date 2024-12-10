import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCcahKLWb99UKcP6ZXvdcetf2Mmzu--WsA",
    authDomain: "summative-5bfb1.firebaseapp.com",
    projectId: "summative-5bfb1",
    storageBucket: "summative-5bfb1.firebasestorage.app",
    messagingSenderId: "836925879910",
    appId: "1:836925879910:web:c625ba8f8aaf3eae1d5fa7"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };