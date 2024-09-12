// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW1sF_jbnialHkvdA8JNAxXC5dYsW0Z9Q",
  authDomain: "khongkhamwebsite.firebaseapp.com",
  projectId: "khongkhamwebsite",
  storageBucket: "khongkhamwebsite.appspot.com",
  messagingSenderId: "442565413989",
  appId: "1:442565413989:web:cfe2c3b687061eb8094a8c",
  measurementId: "G-LT01S12DXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }