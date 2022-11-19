import {getStorage} from 'firebase/storage'
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBJVm3Qlr0lGJ_9uRtXJCk0TcGV4pYeNJo",
  authDomain: "womanupbackend.firebaseapp.com",
  projectId: "womanupbackend",
  messagingSenderId: "465046644875",
  appId: "1:465046644875:web:53fc2721dc8781a66bcc8e",
  measurementId: "G-JBERXEWW8E",

  //storage
  storageBucket: 'gs://womanupbackend.appspot.com',
  //db
  databaseURL: "https://womanupbackend-default-rtdb.europe-west1.firebasedatabase.app/",
};


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const storage = getStorage(app)