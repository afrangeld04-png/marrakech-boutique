import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXWrn1ypSCuZPGpw0II2mpn0l6cyT3Fk",
  authDomain: "marrakech-boutique-15e99.firebaseapp.com",
  projectId: "marrakech-boutique-15e99",
  storageBucket: "marrakech-boutique-15e99.firebasestorage.app",
  messagingSenderId: "5841843379",
  appId: "1:5841843379:web:acc7d790a5d95101856cc6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);