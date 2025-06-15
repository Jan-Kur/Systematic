// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMPNG7nxb3SjKjYQ0MiYCS5JQfifY7Ogo",
  authDomain: "systematic-1.firebaseapp.com",
  projectId: "systematic-1",
  storageBucket: "systematic-1.firebasestorage.app",
  messagingSenderId: "1083515011208",
  appId: "1:1083515011208:web:893836317dfbb394991f3d",
  measurementId: "G-K72B13KECM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);