import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';
import type { User } from '~~/node_modules/firebase/auth';

export const useAppUserState = (initialValue?: UserProfileData | null) => {
  const currentUser = useState<User | UserProfileData>('currentUser', () => null);
  const userProfile = useState<User | UserProfileData>('userProfile', () => null);

  const setCurrentUserState = (user: UserProfileData | null): void => {
    currentUser.value = user;
  }

  const updateCurrentUserState = (value: any): void => {
    userProfile.value = {
      ...userProfile.value,
      ...value
    };
  }

  const clearCurrentUserState = (): void => {
    setCurrentUserState(null);
  }

  return {
    currentUser,
    userProfile,
    setCurrentUserState,
    updateCurrentUserState,
    clearCurrentUserState,
  }
}
