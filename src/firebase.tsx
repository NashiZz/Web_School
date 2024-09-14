// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBWp7EIWDGlEy80zD39krW3UJF_Xc1HlPM",
//   authDomain: "khongkham-school.firebaseapp.com",
//   projectId: "khongkham-school",
//   storageBucket: "khongkham-school.appspot.com",
//   messagingSenderId: "743237254068",
//   appId: "1:743237254068:web:b2fbb13f9dd4ef1f9ed0e1",
//   measurementId: "G-7JP8V8LLKD"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDe2nV2Je93UjAuUgSSlj4okNgazOfBjDo",
  authDomain: "khongkham-web.firebaseapp.com",
  projectId: "khongkham-web",
  storageBucket: "khongkham-web.appspot.com",
  messagingSenderId: "1011052404516",
  appId: "1:1011052404516:web:f232f2b96a1a61aaf6ddb1",
  measurementId: "G-XYZNV1S7LR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }

