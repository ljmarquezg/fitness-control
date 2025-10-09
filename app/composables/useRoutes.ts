export const useRoutes = () => {
  return {
    home: () => '/',
    login: () => '/auth/login',
    register: () => '/auth/register',
    dashboard: () => '/dashboard',
    reports: () => '/reports',
    profile: (userId?: string) => userId ? `/profile/${userId}` : '/profile',
    settings: () => '/settings',
    // Agrega más rutas según tu app
  };
};
