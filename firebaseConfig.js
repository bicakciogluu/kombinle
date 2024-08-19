// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDz4hoelXzV8la4RkiZ4qHVxG7Nn-slPWI",
    authDomain: "kombinle-3c7db.firebaseapp.com",
    projectId: "kombinle-3c7db",
    storageBucket: "kombinle-3c7db.appspot.com",
    messagingSenderId: "280814177334",
    appId: "1:280814177334:web:8b761d27ad961453a69c97",
    measurementId: "G-PK60DNKZ4J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };