import type { User } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';
import { updateProfile } from '~~/node_modules/firebase/auth';
import firebase from '~~/node_modules/firebase/compat';
import { doc, setDoc } from '~~/node_modules/firebase/firestore';
import { useFirebase } from './useFirebase';
import UserCredential = firebase.auth.UserCredential;

const initializeAuthState = (auth: any) => {
  const {
    currentUser,
    setCurrentUserState,
    clearCurrentUserState,
  } = useAppUserState({});
  const { fetchUserProfile } = useUserProfile();
  const { fetchUserSettings } = useSettings();
  const isLoggedIn = useCookie<boolean>('isLoggedIn', {
    default: () => false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  const isFetchingUserLoading: Ref<boolean> = useState('isFetchingUserLoading', () => false);

  if (import.meta.client) {
    onAuthStateChanged(auth, async (user: UserProfileData | null) => {
      isFetchingUserLoading.value = true;
      if (user?.uid) {
        setCurrentUserState(user);
        isLoggedIn.value = true;
        const userProfile: UserProfileData = await fetchUserProfile();
        if (userProfile) {
          await fetchUserSettings();
        } else {
          clearCurrentUserState();
          isLoggedIn.value = false;
        }
      } else {
        clearCurrentUserState();
        isLoggedIn.value = false;
      }
      isFetchingUserLoading.value = false;
    });
  }

  return {
    currentUser,
    clearCurrentUserState,
    isLoggedIn,
    isFetchingUserLoading
  };
};

export const useAuth = () => {
  const { auth } = useFirebase();
  const {
    currentUser,
    clearCurrentUserState,
    isLoggedIn,
    isFetchingUserLoading
  } = initializeAuthState(auth);
  const { clearUserSettingsState } = useAppUserSettingsState();

  const isLoading = ref(false);
  const login = async (email: string, password: string): Promise<User> => {
    isLoading.value = true;
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    isLoading.value = false;
    return userCredential.user;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
    isLoading.value = true;
    const { db } = useFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: 'https://example.com/avatar.png'
      });
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
      });
    }
    isLoading.value = false;
    return user;
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;
    await signOut(auth);
    clearCurrentUserState();
    clearUserSettingsState();
    isLoading.value = false;
    const cookie = useCookie('isLoggedIn');
    cookie.value = null
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
    initializeAuthState,
    isLoading,
    isFetchingUserLoading
  };
};