import { EmailAuthProvider, reauthenticateWithCredential, updateProfile, type User, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { useFirebase } from '~/composables/useFirebase';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';

export const useUserProfile = () => {
  const { db } = useFirebase();
  const {
    currentUser,
    updateCurrentUserState,
    clearCurrentUser,
  } = useAppUserState();
  const toast = useNotifications();
  const isLoadingProfile = useState<boolean>('isLoadingProfile', () => false);

  /**
   * Fetches the user profile from Firestore and updates the local state.
   * If the user profile does not exist in Firestore, it initializes a new profile document.
   *
   * @async
   * @function fetchUserProfile
   * @returns {Promise<void>} Resolves when the profile is fetched or initialized.
   */
  const fetchUserProfile = async (): Promise<UserProfileData> => {
    const user: User | UserProfileData = currentUser.value;

    if (!user) {
      return;
    }
    isLoadingProfile.value = true;

    try {
      const uid: string | undefined = user.uid;
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const snapData: UserProfileData = snap.data();
        if (!snapData?.displayName) {
          snapData['displayName'] = user.displayName || `${snapData?.firstName} ${snapData?.lastName}`;
        }

        const userProfile = {
          photoUrl: user?.photoURL,
          ...snapData
        };

        updateCurrentUserState(userProfile);
        return userProfile;
      } else {
        console.log('📝 No profile found for user:', uid);
        toast.info('No se encontró perfil, creando uno nuevo...');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      toast.error('Error cargando el perfil');
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const createUserProfile = async (user: UserProfileData, additionalData?: Partial<UserProfileData>): Promise<void> => {
    if (!user.uid) throw new Error('User UID is required');

    isLoadingProfile.value = true;
    try {
      const docRef = doc(db, 'users', user.uid);
      const newProfile: UserProfileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {},
        ...additionalData
      };

      await setDoc(docRef, newProfile);
      currentUser.value = newProfile;
      console.log('✅ User profile created');
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      toast.error('Error creando el perfil del usuario');
      throw error;
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const updateUserEmail = async (newEmail: string, currentPassword) => {
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);
      await currentUser?.value?.reload();
      toast.success('Correo actualizado correctamente');
    } catch (error) {
      toast.error('Error actualizando el correo:', error);
      throw error;
    }
  };

  /**
   * Updates the user's profile in Firebase Auth, Firestore, and the local state.
   *
   * @async
   * @function updateUserProfile
   * @param {Record<string, any>} data - An object containing the user's profile data to update.
   * @throws {Error} Throws an error if no user is logged in or if the update process fails.
   * @returns {Promise<void>} Resolves when the profile is successfully updated.
   */
  const updateUserProfile = async (data: Record<string, any>): Promise<UserProfileData> => {
    isLoadingProfile.value = true;
    const user: User | UserProfileData = currentUser.value;
    try {
      if (!user) throw new Error('No user logged in');

      // 1️⃣ Firebase Auth
      await updateProfile(user, {
        displayName: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        photoURL: data.photoURL || null,
      });

      // 2️⃣ Firestore
      const uid = user.uid;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      delete cleanData.email;

      await setDoc(doc(db, 'users', uid), {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 3️⃣ Local state
      updateCurrentUserState({ ...user.value, ...cleanData });
      return user;

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      toast.error('Error actualizando el perfil');
      throw error;
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const clearProfile = () => {
    clearCurrentUser(null);
    console.log('🧹 Profile data cleared');
  };

  return {
    clearProfile,
    isLoadingProfile,
    fetchUserProfile,
    updateUserProfile,
    updateUserEmail,
  };
};
