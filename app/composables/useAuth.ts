import type { User } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';
import { useFirebase } from './useFirebase';

const initializeAuthState = (auth: any) => {
  const currentUser = useState<User | UserProfileData>('currentUser', () => null);
  // const profileData = useState<Record<string, UserProfileData> | null>('profileData', () => null);
  const { fetchUserProfile } = useUserProfile();
  const isLoggedIn = computed(() => !!currentUser.value);
  // 🔹 Watch auth changes once globally
  if (process.client) {
    // Escucha cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed. User:', user ? user.email : 'No user');
      if (user) {
        // currentUser.value = user;
        currentUser.value = await fetchUserProfile(user);
        console.log(currentUser);
      } else {
        currentUser.value = null;
      }
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
  const isLoading = ref(false);

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
      currentUser.value = null;
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      throw error;
    }
  };

  const onAuthChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };

  const updateCurrentUserState = (user: UserProfileData | null): void => {
    currentUser.value = user;
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    onAuthChanged,
    updateCurrentUserState
  };
};