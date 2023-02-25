// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { firestore } from "firebase/firestore";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3WB026JbnVHgSJCW7kMv1PKUkeBws2b4",
  authDomain: "cloud-accounting-2.firebaseapp.com",
  projectId: "cloud-accounting-2",
  storageBucket: "cloud-accounting-2.appspot.com",
  messagingSenderId: "579553647862",
  appId: "1:579553647862:web:1936bcf712ebc0889920d7"
};
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { firebaseApp, db };
