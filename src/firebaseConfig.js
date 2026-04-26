import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// Other config fields could go here
};

// Initialize Firebase only if config is provided
let app;
let analytics;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    isSupported().then(supported => {
      if (supported) {
         analytics = getAnalytics(app);
      }
    });
  } catch (error) {
    console.error("Firebase initialization failed", error);
  }
}

export { app, analytics };
