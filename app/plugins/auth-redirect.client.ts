export default defineNuxtPlugin((): void => {
  if (import.meta.server) return;

  const router = useRouter()
  const routes = useRoutes();
  const { isLoggedIn } = useAuth();
  const toLogin = routes.login();
  const toRegister = routes.register();
  const toDashboard = routes.dashboard();

  watch(isLoggedIn, async (loggedIn): void => {
    const currentPath = router.currentRoute.value.path

    if (loggedIn) {
      if (currentPath === toLogin || currentPath === toRegister) {
        await router.push(toDashboard);
      } else {
        await router.push(currentPath);
      }
    } else {
      if (currentPath !== toLogin || currentPath !== toRegister) {
        await router.push(toLogin);
      }
    }
  });
});