import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbiUXJ74G7RxLLnc9KUiILM8IzJZpuROc",
  authDomain: "codewithanil-bd709.firebaseapp.com",
  projectId: "codewithanil-bd709",
  storageBucket: "codewithanil-bd709.firebasestorage.app",
  messagingSenderId: "845556420907",
  appId: "1:845556420907:web:65fb587f12b22345b9356e",
  measurementId: "G-GQKVNV8VML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Initialize analytics
const analytics = getAnalytics(app);

// Create Google provider
const googleProvider = new GoogleAuthProvider();

// Configure Google provider with standard parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider }; 