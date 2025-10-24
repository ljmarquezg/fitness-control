const routes = useRoutes();
export const useDashboardNavigation = {
  dashboard: () => ({
    label: 'dashboard.navigationLabel',
    url: routes.dashboard()
  }),
  reports: () => ({
    label: 'reports.navigationLabel',
    url: routes.reports()
  }),
  profile: () => ({
    label: 'profile.navigationLabel',
    url: routes.profile()
  }),
  settings: () => ({
    label: 'settings.navigationLabel',
    url: routes.settings()
  })
};