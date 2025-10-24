export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const routes = useRoutes();
  const notifications = useNotifications();
  const { isLoggedIn } = useAuth();
  const toLogin = routes.login();
  const toDashboard = routes.dashboard();

  watchEffect(() => {
    if (!isLoggedIn.value && to.path !== toLogin) {
      return navigateTo(toLogin, { replace: true });
    }

    if (isLoggedIn.value && to.path === toLogin) {
      return navigateTo(toDashboard, { replace: true });
    }
  });

  /*// Redirigir a login si no hay sesión
  if (
    !auth.currentUser.value &&
    (to.path.startsWith(routes.dashboard()) || to.path.startsWith(routes.home()))
  ) {
    return navigateTo(routes.login())
  }

  console.log(auth.currentUser.value)
  // Redirigir a dashboard si intenta acceder a login/register estando logueado
  if (auth.currentUser.value && (to.path === routes.login() || to.path === routes.register())) {
    return navigateTo(routes.dashboard())
  }*/
});