export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  const routes = useRoutes()

  if (!isLoggedIn.value && to.meta.requiresAuth) {
    return navigateTo(routes.login())
  } else {
    if(isLoggedIn.value && (to.path === routes.login() || to.path === routes.register())) {
      return navigateTo(routes.dashboard())
    }
  }
})