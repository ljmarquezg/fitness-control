import type { User } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebase } from './useFirebase';

const initializeAuthState = (auth: any) => {
  const currentUser = useState<User | null>('currentUser', () => null);
  const isLoggedIn = computed(() => !!currentUser.value);

  // 🔹 Watch auth changes once globally
  if (process.client) {
    // Escucha cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user;
      console.log(user);
      // isLoggedIn.value = !!user; // true si hay un usuario logueado, false si es null
    });
  }

  return {
    currentUser,
    isLoggedIn
  };
};

export const useAuth = () => {
  const { auth } = useFirebase();
  const {
    currentUser,
    isLoggedIn
  } = initializeAuthState(auth);

  const notification = useNotifications();

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      notification.error('Error logging in:', error);
      console.error('❌ Error logging in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Error registering user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      throw error;
    }
  };

  const onAuthChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };

  return {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    onAuthChanged
  };
};