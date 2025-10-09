import { updateProfile, reauthenticateWithCredential, verifyBeforeUpdateEmail, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';

export const useUserProfile = () => {
  const {
    auth,
    db
  } = useFirebase();
  const toast = useNotifications();
  const { currentUser } = useAuth();
  const profileData = useState<Record<string, any>>('profileData', () => ({}));
  const isLoadingProfile = ref(false);

  /**
   * Fetches the user profile from Firestore and updates the local state.
   * If the user profile does not exist in Firestore, it initializes a new profile document.
   *
   * @async
   * @function fetchUserProfile
   * @returns {Promise<void>} Resolves when the profile is fetched or initialized.
   */
  const fetchUserProfile = async () => {
    // Esperar a que currentUser esté disponible
    if (!currentUser.value) {
      console.warn('⏳ Esperando autenticación...');
      return;
    }

    console.log('Fetching user profile...', currentUser.value.uid);

    try {
      const uid = currentUser?.value?.uid;
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const snapData = snap.data();
        if (!snapData?.displayName) {
          snapData['displayName'] = currentUser.value.displayName || `${snapData?.firstName} ${snapData?.lastName}`;
        }
        profileData.value = {
          photoUrl: currentUser.value?.photoURL,
          ...snapData
        };

      } else {
        await setDoc(docRef, {
          email: currentUser?.value?.email,
          createdAt: new Date().toISOString(),
        });
        profileData.value = {};
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      toast.error('Error cargando el perfil');
    } finally {
      isLoadingProfile.value = false;
    }
  };

  const updateUserEmail = async (newEmail: string, currentPassword) => {
    const user = currentUser.value;
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);
      await auth.currentUser?.reload();
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
  const updateUser = async (data: Record<string, any>) => {
    console.log(data);
    try {
      const user = currentUser.value;
      if (!user) throw new Error('No user logged in');

      // 1️⃣ Firebase Auth
      await updateProfile(user, {
        displayName: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        photoURL: data.photoURL || null,
      });

      // 2️⃣ Firestore
      const { db } = useFirebase();
      const uid = user.uid;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      delete cleanData.email; // No actualizar email aquí

      await setDoc(doc(db, 'users', uid), {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 3️⃣ Local state
      profileData.value = { ...profileData.value, ...data };

      toast.success('✅ Perfil actualizado correctamente');
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      toast.error('Error actualizando el perfil');
      throw error;
    }
  };

  watch(currentUser, async (newUser) => {
    if (newUser) {
      await fetchUserProfile();
    }
  }, { immediate: true });

  return {
    currentUser,
    isLoadingProfile,
    profileData,
    fetchUserProfile,
    updateUser,
    updateUserEmail,
  };
};
