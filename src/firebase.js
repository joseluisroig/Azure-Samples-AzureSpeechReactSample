// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgF1OD4ewGRI0VjEab9LFwlWue8DEYylY",
  authDomain: "huma3digitalweb.firebaseapp.com",
  projectId: "huma3digitalweb",
  storageBucket: "huma3digitalweb.appspot.com",
  messagingSenderId: "890354959724",
  appId: "1:890354959724:web:87d816f1af255f8958df49",
  measurementId: "G-ZL25GT5R3P"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };