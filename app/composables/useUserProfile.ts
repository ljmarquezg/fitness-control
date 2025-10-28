import { EmailAuthProvider, reauthenticateWithCredential, updateProfile, type User, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { useFirebase } from '~/composables/useFirebase';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';

export const UserProfileFields: string[] = [
  'uid',
  'firstName',
  'lastName',
  'email',
  'photoURL',
  'age',
  'settings',
  'sex',
];

export const UserProfileExtendedFields = [
  ...UserProfileFields,
  'displayName',
  'weight',
  'height',
  'chest',
  'hip',
  'waist',
];

export const useUserProfile = () => {
  const {
    getDocument,
    setDocument,
    documentRef
  } = useFirestoreDatabase();
  const {
    currentUser,
    updateCurrentUserState,
    clearCurrentUser,
  } = useAppUserState();
  const notifications = useNotifications();
  const isLoadingProfile: Ref<boolean> = useState<boolean>('isLoadingProfile', (): boolean => false);

  /**
   * Fetches the user profile from Firestore and updates the local state.
   * If the user profile does not exist in Firestore, it initializes a new profile document.
   *
   * @async
   * @function fetchUserProfile
   * @returns {Promise<void>} Resolves when the profile is fetched or initialized.
   */
  const fetchUserProfile = async (): Promise<UserProfileData> => {
    const user: UserProfileData = currentUser.value;
    if (!user) {
      return;
    }
    isLoadingProfile.value = true;

    try {
      const uid: string | undefined = user.uid;
      const snap = await getDocument();
      if (snap.exists()) {
        const snapData: UserProfileData = snap.data();
        if (!snapData?.displayName) {
          snapData['displayName'] = user.displayName || `${snapData?.firstName} ${snapData?.lastName}`;
        }

        const userProfile = {
          uid,
          photoUrl: user?.photoURL,
          ...snapData
        };
        updateCurrentUserState(userProfile);
        return userProfile;
      } else {
        notifications.info('No se encontró perfil, creando uno nuevo...');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      notifications.error('Error cargando el perfil');
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const createUserProfile = async (user: UserProfileData, additionalData?: Partial<UserProfileData>): Promise<void> => {
    if (!user.uid) throw new Error('User UID is required');

    isLoadingProfile.value = true;
    try {
      const docRef = documentRef();
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

      await setDocument(docRef, newProfile);
      updateCurrentUserState(newProfile);
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      notifications.error('Error creando el perfil del usuario');
      throw error;
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const updateUserEmail = async (newEmail: string, currentPassword): Promise<void> => {
    const user: UserProfileData = currentUser.value;
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);
      await currentUser?.value?.reload();
      notifications.success('Correo actualizado correctamente');
    } catch (error) {
      notifications.error('Error actualizando el correo:', error);
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
  const updateUserProfile = async (data: Record<string, UserProfileData>): Promise<UserProfileData> => {
    isLoadingProfile.value = true;
    const user: UserProfileData = currentUser.value;
    try {
      if (!user) throw new Error('No user logged in');

      const firstName = data.firstName?.trim() || '';
      const lastName = data.lastName?.trim() || '';
      // 1️⃣ Firebase Auth
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: data.photoURL || null,
      });

      // 2️⃣ Firestore
      const uid: string = user.uid;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      delete cleanData.email;

      await setDocument('users', uid, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 3️⃣ Local state
      updateCurrentUserState({ ...user, ...cleanData });
      return user;

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      notifications.error('Error actualizando el perfil');
      throw error;
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const clearProfile = (): void => {
    clearCurrentUser(null);
  };

  const isUserProfileCompleted = (): boolean => {
    const user: UserProfileData = currentUser?.value;
    if (!user?.uid) return false;
    return UserProfileFields.every((field: string) => {
      const value = user[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  return {
    createUserProfile,
    clearProfile,
    isLoadingProfile,
    fetchUserProfile,
    updateUserProfile,
    updateUserEmail,
    isUserProfileCompleted,
  };
};
