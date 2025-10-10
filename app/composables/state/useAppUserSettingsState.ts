import { useAppUserState } from '~/composables/state/useAppUserState';
import type { UnitsPreferencesSchema } from '~/schemas/settings/UnitsSchema';

export const useAppUserSettingsState = () => {
  const { updateCurrentUserState } = useAppUserState();
  const userSettings: Ref<UnitsPreferencesSchema> = useState<UnitsPreferencesSchema>('userSettings', () => null);

  const updateUserSettingsState = (settings: UnitsPreferencesSchema): void => {
    userSettings.value = settings;

    updateCurrentUserState({
      settings: settings || {}
    });
  };

  const clearUserSettingsState = (): void => {
    updateUserSettingsState(null);
  };

  return {
    userSettings,
    updateUserSettingsState,
    clearUserSettingsState,
  };
};
