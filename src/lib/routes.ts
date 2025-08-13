export const APP_ROUTES = {
  HOME: "/",
  CATALOGS: "/catalogs",
  PLANNER: "/planner",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const NAV_ROUTES = [
  { label: "Home", route: APP_ROUTES.HOME },
  { label: "Catalogs", route: APP_ROUTES.CATALOGS },
  { label: "Planner", route: APP_ROUTES.PLANNER },
] as const;
