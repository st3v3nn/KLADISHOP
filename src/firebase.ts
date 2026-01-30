import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBP2-QRxdUrnxjkp2IWdrELTZvp-cUzpJ0",
  authDomain: "kladishop-7ad46.firebaseapp.com",
  projectId: "kladishop-7ad46",
  storageBucket: "kladishop-7ad46.firebasestorage.app",
  messagingSenderId: "413900521131",
  appId: "1:413900521131:web:39a07838d4c650431901ee",
  measurementId: "G-L2L6GDRRZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
