// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZA6c4J2xGwULLxjgBPHa-qFaf-nEqBjs",
    authDomain: "chat-app-9-7-2022.firebaseapp.com",
    projectId: "chat-app-9-7-2022",
    storageBucket: "chat-app-9-7-2022.appspot.com",
    messagingSenderId: "609257176416",
    appId: "1:609257176416:web:6c94c3f28db2033e3af205",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
