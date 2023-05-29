// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth ,GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBfryp81Yod5bx_7x7DVl5VrixD5Dg7jU",
  authDomain: "chatify-271.firebaseapp.com",
  projectId: "chatify-271",
  storageBucket: "chatify-271.appspot.com",
  messagingSenderId: "1056960803291",
  appId: "1:1056960803291:web:7cefc6fbd69834797db7fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authUser=getAuth(app)

export const provider=new GoogleAuthProvider()

export const db=getFirestore(app)

export const storage=getStorage(app)

