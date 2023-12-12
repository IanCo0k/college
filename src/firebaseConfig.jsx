// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGhmWGLcnBUYlyQu0nAC31m0rHvW6uUj8",
  authDomain: "college-1ec09.firebaseapp.com",
  projectId: "college-1ec09",
  storageBucket: "college-1ec09.appspot.com",
  messagingSenderId: "364917850429",
  appId: "1:364917850429:web:d6d63563c37e3728efc554",
  measurementId: "G-V0N16ZXFBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export default app;