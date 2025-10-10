import type { User } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';
import { updateProfile } from '~~/node_modules/firebase/auth';
import { doc, setDoc } from '~~/node_modules/firebase/firestore';
import { useFirebase } from './useFirebase';

const initializeAuthState = (auth: any) => {
  const {
    currentUser,
    setCurrentUserState,
    clearCurrentUserState,
  } = useAppUserState({});
  const { fetchUserProfile } = useUserProfile();
  const { fetchUserSettings } = useSettings();
  const isLoggedIn: ComputedRef<boolean> = computed(() => !!currentUser.value);
  // 🔹 Watch auth changes once globally
  if (process.client) {
    // Escucha cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserState(user);
        const userProfile: UserProfileData = await fetchUserProfile();
        const userSettings: void = await fetchUserSettings();
      } else {
        clearCurrentUserState();
      }
    });
  }

  return {
    currentUser,
    clearCurrentUserState,
    isLoggedIn
  };
};

export const useAuth = () => {
  const { auth } = useFirebase();
  const {
    currentUser,
    clearCurrentUserState,
    isLoggedIn
  } = initializeAuthState(auth);
  const { clearUserSettingsState } = useAppUserSettingsState();
  const isLoading = ref(false);
  const notifications = useNotifications();

  const login = async (email: string, password: string) => {
    try {
      const { t } = useI18n();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      notifications.success(t('login.success.title'), 'login.success.message');
      return userCredential.user;
    } catch (error) {
      notifications.error(t('login.error.title'), 'login.error.message');
      console.error('❌ Error logging in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const { t } = useI18n();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        try {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
            photoURL: 'https://example.com/avatar.png'
          });
        } catch (error) {
          console.error('❌ Error updating user profile:', error);
        }

        const db = useFirebase().db;

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString()
        });

        notifications.success(`Welcome ${firstName} ${lastName}`, t('register.success_message'));
      }

      return user;
    } catch (error) {
      console.error('❌ Error registering user:', error);
      notifications.error(t('register.error.title'), 'register.error.message');
      throw error;
    }
  };

  const logout = async () => {
    const { t } = useI18n();
    try {
      await signOut(auth);
      clearCurrentUserState();
      clearUserSettingsState();
      notifications.success(t('logout.success.title'), 'logout.success.message');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      notifications.error(t('logout.error.title'), 'logout.error.message');
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
    onAuthChanged,
  };
};