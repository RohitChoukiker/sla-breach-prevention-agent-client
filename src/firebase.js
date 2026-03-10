import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDyc54XO80TihjfBjvrOVqSR9LELDC0PI",
  authDomain: "sla-breach-prevention-agent.firebaseapp.com",
  projectId: "sla-breach-prevention-agent",
  storageBucket: "sla-breach-prevention-agent.firebasestorage.app",
  messagingSenderId: "743252729664",
  appId: "1:743252729664:web:a4b69ea0c486b63e06e4a5",
  measurementId: "G-6B626T51B4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };