
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBki3dvKVWFGJV1rGgw4cOCX8d5so6q-1g",
  authDomain: "legit-battle-287f1.firebaseapp.com",
  databaseURL: "https://legit-battle-287f1-default-rtdb.firebaseio.com",
  projectId: "legit-battle-287f1",
  storageBucket: "legit-battle-287f1.firebasestorage.app",
  messagingSenderId: "506255749413",
  appId: "1:506255749413:web:4d943c61b6d22bc7bc2acc",
  measurementId: "G-1QW43BNPNJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
