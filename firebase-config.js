// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { firestore } from "firebase/firestore";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASwpceW04L8V0E-TT7b7Fwly6Pabx0mbE",
  authDomain: "loginwith-firebase-bed8c.firebaseapp.com",
  projectId: "loginwith-firebase-bed8c",
  storageBucket: "loginwith-firebase-bed8c.appspot.com",
  messagingSenderId: "348462014831",
  appId: "1:348462014831:web:1daa0229fcf2bc765d089a"
};
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { firebaseApp, db };
