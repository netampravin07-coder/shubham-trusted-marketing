import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkf59KSdBs-pPbzz3SyMnCoqr8YP5Tn_A",
  authDomain: "shubham-trusted-marketing.firebaseapp.com",
  projectId: "shubham-trusted-marketing",
  storageBucket: "shubham-trusted-marketing.firebasestorage.app",
  messagingSenderId: "306646864791",
  appId: "1:306646864791:web:f908b516f9a771d2062ad2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

window.registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

window.loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

window.googleLogin = () =>
  signInWithPopup(auth, provider);

window.logoutUser = () =>
  signOut(auth);

window.addProductToDb = async (name, price, description, imageUrl) => {
  return await addDoc(collection(db, "products"), {
    name,
    price: Number(price),
    description,
    imageUrl,
    createdAt: serverTimestamp()
  });
};

window.getProductsFromDb = async () => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
};

window.deleteProductFromDb = async (id) => {
  return await deleteDoc(doc(db, "products", id));
};
window.createOrder = async (name, price) => {
  if (!auth.currentUser) {
    throw new Error("Please login first.");
  }

  return await addDoc(collection(db, "orders"), {
    productName: name,
    price: Number(price),
    status: "Pending",
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp()
  });
};
console.log("Firebase Ready!");
