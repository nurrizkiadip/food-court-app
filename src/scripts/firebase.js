// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBQogAT70QhI5if6wlPoISZfBOIVYZyVTw',
  authDomain: 'food-court-app-7f09e.firebaseapp.com',
  projectId: 'food-court-app-7f09e',
  storageBucket: 'food-court-app-7f09e.appspot.com',
  messagingSenderId: '863277865912',
  appId: '1:863277865912:web:b74e1c7faf486a4a198d4d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, location.hostname, 9199);

  console.log('localhost detected!');
}

export { app, auth, db, storage };
