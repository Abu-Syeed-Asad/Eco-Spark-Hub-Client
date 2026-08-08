
export type userRole = "ADMIN" | "USER";
export type IdentifyRouteRole = "ADMIN" | "USER" | "COMMON" | null;
export const publicAuthRouter = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forget-password",
  "/auth/reset-password",
];

export const isAuthRoute = (pathName: string): boolean => {
  return publicAuthRouter.some((route) => route === pathName);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};
export const commonProtectedRoute: RouteConfig = {
  exact: ["/auth/me", "/auth/change-password"],
  pattern: [],
};
export const userProtectedRoute: RouteConfig = {
  pattern: [/^\/dashboard\/user(\/.*)?$/],
  exact: [],
};
export const adminProtectedRoute: RouteConfig = {
  pattern: [/^\/dashboard\/admin(\/.*)?$/],
  exact: [],
};

export const isRouteMatch = (
  pathName: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathName)) {
    return true;
  }
  return routes.pattern.some((pattern) => pattern.test(pathName));
};

export const getRouteOwner = (pathName: string): IdentifyRouteRole => {
  if (isRouteMatch(pathName, userProtectedRoute)) {
    return "USER";
  }
  if (isRouteMatch(pathName, adminProtectedRoute)) {
    return "ADMIN";
  }
  if (isRouteMatch(pathName, commonProtectedRoute)) {
    return "COMMON";
  }
  return null;
};
export const getDefaultDashboardRoute = (role: userRole) => {
 
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }
  if (role === "USER") {
    return "/dashboard/user";
  }
  return "/";
};
export const isValidRedirectForRole = (
  redirectPath: string,
  role: userRole,
) => {
  const routeOwner = getRouteOwner(redirectPath); // retur user admnin coomn null
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) {
    return true;
  }
  return false;
};
