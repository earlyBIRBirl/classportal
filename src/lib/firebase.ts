// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// NOTE: Storage is not used because it requires a paid plan.
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "campuspass-660js",
  appId: "1:163261731214:web:3a2e17002dd5e5c91f94df",
  storageBucket: "campuspass-660js.appspot.com",
  apiKey: "AIzaSyA2SclsokkL_J3tx3lBLqMvyTOabIynL3k",
  authDomain: "campuspass-660js.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "163261731214",
  databaseURL: "https://campuspass-660js-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const storage = getStorage(app);
