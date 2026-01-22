import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzkLGEjZQ9Ilh1y5Ly8870zRy0afb26rY",
    authDomain: "pertutoclasses.firebaseapp.com",
    projectId: "pertutoclasses",
    storageBucket: "pertutoclasses.firebasestorage.app",
    messagingSenderId: "246050353260",
    appId: "1:246050353260:web:81342611f1952fe25fa849",
    measurementId: "G-H2RGQ50B1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export default app;
