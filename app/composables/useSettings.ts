import type { User } from 'firebase/auth';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { useFirebase } from '~/composables/useFirebase';
import type { UserSettingsSchema } from '~/schemas/profile/UserProfileSchema';
import type { UnitsPreferencesSchema } from '~/schemas/settings/UnitsSchema';
import firebase from '~~/node_modules/firebase/compat';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import QuerySnapshot = firebase.firestore.QuerySnapshot;

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
  const notifications = useNotifications();
  const {
    updateCurrentUserState
  } = useAppUserState();
  const {
    userSettings,
    updateUserSettingsState,
  } = useAppUserSettingsState();
  const {
    getCollection,
    setDocument
  } = useFirestoreDatabase();
  const isLoadingSettings: Ref<boolean> = ref(false);

  /**
   * Fetches the user settings from the Firestore database and updates the application state.
   *
   * @param {User} user - The user object containing the `uid` of the currently logged-in user.
   * @returns {Promise<void>} A promise that resolves when the user settings have been fetched and the state is updated.
   */
  const fetchUserSettings = async (): Promise<void> => {
    isLoadingSettings.value = true;
    try {
      const querySnapshot: QuerySnapshot<UserSettingsSchema, UserSettingsSchema> = await getCollection('settings');
      const settings: Record<string, UserSettingsSchema> = {};

      querySnapshot.forEach((docSnap: QueryDocumentSnapshot<UserSettingsSchema>): void => {
        settings[docSnap.id] = docSnap.data();
      });

      updateUserSettingsState(settings);
    } catch (error) {
      console.error('❌ Error fetching user settings:', error);
      notifications.error('Error cargando la configuración del usuario');
    } finally {
      isLoadingSettings.value = false;
    }
  };

  const updateUserSettings = async (settings: UnitsPreferencesSchema): Promise<void> => {
    isLoadingSettings.value = true;
    try {
      await setDocument('settings', 'measurements', {
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

  const updateUserPreferences = async (userSettings: UserSettingsSchema): Promise<void> => {
    isLoadingSettings.value = true;
    try {
      alert();
      const preferences = {
        language: userSettings.preferences?.language
      };

      await setDocument('settings', 'preferences', {
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