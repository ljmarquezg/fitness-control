export default defineNuxtRouteMiddleware((to, from) => {
  const routes = useRoutes();
  if (process.server) return;
  const auth = useAuth();

  watch(() => auth.isLoggedIn.value, (loggedIn) => {
    if (!loggedIn) {
      console.log('Usuario no logueado, redirigiendo...');
      navigateTo(routes.login());
    } else {
      if (to.path === routes.login() || to.path === routes.register()) {
        console.log('Usuario logueado:', auth.currentUser.value?.email);
        return navigateTo(routes.home());
      }
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