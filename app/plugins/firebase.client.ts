import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
  };

  // Verificar que la configuración existe
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase config is missing. Check your .env file');
    return;
  }

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize services
    const db = getFirestore(app);
    const auth = getAuth(app);

    // Make available throughout the app
    return {
      provide: {
        firebase: app,
        db,
        auth
      }
    };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
});