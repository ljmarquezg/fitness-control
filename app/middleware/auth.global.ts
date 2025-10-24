export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  const routes = useRoutes()

  if (!isLoggedIn.value && to.meta.requiresAuth) {
    return navigateTo(routes.login())
  }
})