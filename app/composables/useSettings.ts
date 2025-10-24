import type { User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { useFirebase } from '~/composables/useFirebase';
import type { UserProfileData, UserSettings } from '~/schemas/profile/UserProfileSchema';
import type { UnitsPreferencesSchema } from '~/schemas/settings/UnitsSchema';

export const useSettingsTranslations = {
  weight: () => ({
    metric: {
      label: 'settings.form.metric.weight',
      value: 'kg'
    },
    imperial: {
      label: 'settings.form.imperial.weight',
      value: 'lb'
    }
  }),
  height: () => ({
    metric: {
      label: 'settings.form.metric.height',
      value: 'cm'
    },
    imperial: {
      label: 'settings.form.imperial.height',
      value: 'ft-in'
    }
  }),
};

export const useSettings = () => {
  const toast = useNotifications();
  const {
    currentUser,
    updateCurrentUserState
  } = useAppUserState();
  const {
    userSettings,
    updateUserSettingsState
  } = useAppUserSettingsState();
  const { db } = useFirebase();
  const isLoadingSettings = ref(false);

  /**
   * Fetches the user settings from the Firestore database and updates the application state.
   *
   * @param {User} user - The user object containing the `uid` of the currently logged-in user.
   * @returns {Promise<void>} A promise that resolves when the user settings have been fetched and the state is updated.
   */
  const fetchUserSettings = async (): Promise<void> => {
    const uid: string = currentUser?.value?.uid;
    if (uid) {
      isLoadingSettings.value = true;
      try {
        const settingsCollectionRef = collection(db, 'users', uid, 'settings');
        const querySnapshot = await getDocs(settingsCollectionRef);
        const settings: Record<string, any> = {};

        querySnapshot.forEach((docSnap): coid => {
          settings[docSnap.id] = docSnap.data();
        });

        console.log('settings collection ref', settings);
        updateUserSettingsState(settings);
      } catch (error) {
        console.error('❌ Error fetching user settings:', error);
        toast.error('Error cargando la configuración del usuario');
      } finally {
        isLoadingSettings.value = false;
      }
    }
  };

  const updateUserSettings = async (settings: UnitsPreferencesSchema): Promise<void> => {
    const user: User | UserProfileData = currentUser.value;
    isLoadingSettings.value = true;
    try {
      if (!user) throw new Error('No user logged in');
      const uid = user.uid;
      const docRef = doc(db, 'users', uid, 'settings', 'measurements');
      const snap = await getDoc(docRef);

      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      updateCurrentUserState(settings);
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    } finally {
      isLoadingSettings.value = false;
    }
  };

  const updateUserPreferences = async (userSettings: UserSettings): Promise<void> => {
    const user: UserProfileData = currentUser.value;
    isLoadingSettings.value = true;
    try {
      if (!user) throw new Error('No user logged in');
      const uid = user.uid;
      const docRef = doc(db, 'users', uid, 'settings', 'preferences');
      const snap = await getDoc(docRef);

      const preferences = { language: userSettings.preferences?.language };

      await setDoc(docRef, {
        ...preferences,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      updateCurrentUserState(userSettings);

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    } finally {
      isLoadingSettings.value = false;
    }
  };

  return {
    fetchUserSettings,
    updateUserSettings,
    updateUserPreferences,
    isLoadingSettings,
    userSettings
  };
};