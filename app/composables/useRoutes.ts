export const useRoutes = () => {
  return {
    home: (): string => '/',
    login: (): string => '/auth/login',
    register: (): string => '/auth/register',
    dashboard: (): string => '/dashboard',
    reports: (): string => '/reports',
    profile: (edit?: boolean): string => edit ? `/profile/edit` : '/profile',
    settings: (): string => '/settings',
  };
};
