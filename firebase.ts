// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDVDQUvZJK3Vqm-jXw8hjyvMTVIp1TSKl4",
  authDomain: "notion-clone-6a2dd.firebaseapp.com",
  projectId: "notion-clone-6a2dd",
  storageBucket: "notion-clone-6a2dd.firebasestorage.app",
  messagingSenderId: "586747975434",
  appId: "1:586747975434:web:4ffb639ac877fe3eafccf3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };