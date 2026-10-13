import { NextRequest, NextResponse } from "next/server";
import { tokenUtils } from "./lib/token/tokenUtils";
import { jwtUtils } from "./lib/jwt/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  userRole,
} from "./lib/auth/authUtils";
import {
  getNewTokenWithRefreshToken,
  getUserInfo,
} from "./service/auth/auth.service";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenMiddleWare = async (
  refreshToken: string,
  sessionToken: string,
) => {
  try {
    return await getNewTokenWithRefreshToken(refreshToken, sessionToken);
  } catch (error) {
    console.log(`Error refreshing token in proxy middleware `, error);
    return null;
  }
};

export const proxy = async (request: NextRequest) => {
  try {
    const pathName = request.nextUrl.pathname;
    const rawCookieHeader = request.headers.get("cookie") ?? "";
    const parsedCookies = Object.fromEntries(
      rawCookieHeader
        .split("; ")
        .filter(Boolean)
        .map((cookie) => {
          const [name, ...vals] = cookie.split("=");
          return [name, vals.join("=")];
        }),
    );

    const accessToken =
      request.cookies.get("access_token")?.value || parsedCookies.access_token;
    const refreshToken =
      request.cookies.get("refresh_token")?.value || parsedCookies.refresh_token;
    const requestSessionToken =
      request.cookies.get("session_token")?.value || parsedCookies.session_token;
    const decodedAccessToken =
      accessToken &&
      jwtUtils.veryfyToken(accessToken, accessTokenSecret as string).data;
    const isValidAccesstoken =
      accessToken &&
      jwtUtils.veryfyToken(accessToken, accessTokenSecret as string).success;

    let User_Role: userRole | null = null;
    if (decodedAccessToken) {
      User_Role = decodedAccessToken.role as userRole;
    }
const routeOwner = getRouteOwner(pathName);
    

    const isAuth = isAuthRoute(pathName);

    const shouldRefreshToken =
      Boolean(refreshToken && requestSessionToken) &&
      (!isValidAccesstoken ||
        Boolean(
          accessToken && tokenUtils.isTokenExpiringSoon(accessToken),
        ));

    if (shouldRefreshToken) {
      const requestHeaders = new Headers(request.headers);

      try {
        const refreshed = requestSessionToken
          ? await refreshTokenMiddleWare(refreshToken, requestSessionToken)
          : null;
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
          const forwardedCookies = new Map(
            request.cookies
              .getAll()
              .map(({ name, value }) => [name, value]),
          );
          forwardedCookies.set("access_token", refreshed.access_token);
          forwardedCookies.set("refresh_token", refreshed.refreshToken);
          forwardedCookies.set("session_token", refreshed.session_token);
          requestHeaders.set(
            "cookie",
            Array.from(
              forwardedCookies,
              ([name, value]) => `${name}=${value}`,
            ).join("; "),
          );

          const refreshedResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          const cookieOptions = {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          };
          refreshedResponse.cookies.set("access_token", refreshed.access_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24,
          });
          refreshedResponse.cookies.set("refresh_token", refreshed.refreshToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7,
          });
          refreshedResponse.cookies.set("session_token", refreshed.session_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7,
          });
          return refreshedResponse;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
    //  redirection
    if (
      isAuth &&
      pathName !== "/auth/login" &&
      isValidAccesstoken &&
      User_Role
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(User_Role), request.url),
      );
    }
    if (pathName === "/auth/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      if (accessToken && email) {
        const userInfo = await getUserInfo();
        if (userInfo?.needPasswordChange) {
          return NextResponse.next();
        } else {
          if (User_Role) {
            return NextResponse.redirect(
              new URL(getDefaultDashboardRoute(User_Role), request.url),
            );
          }
        }
      }
      if (email) {
        return NextResponse.next();
      }
      const loginURL = new URL("/auth/login", request.url);
      loginURL.searchParams.set("redirect", pathName);
      return NextResponse.redirect(loginURL);
    }
    if (routeOwner === null) {
      return NextResponse.next();
    }
    if (!accessToken || !isValidAccesstoken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathName);
      return NextResponse.redirect(loginUrl);
    }
    if (accessToken) {
      const userinfo = await getUserInfo();
      if (!userinfo) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathName);
        return NextResponse.redirect(loginUrl);
      }
      if (userinfo.emailVerified === false) {
        if (pathName !== "/auth/verify-email") {
          const verifyEmailUrl = new URL("/auth/verify-email", request.url);
          verifyEmailUrl.searchParams.set("email", userinfo.email);
          return NextResponse.redirect(verifyEmailUrl);
        }
        return NextResponse.next();
      }
      if (
        userinfo.emailVerified &&
        pathName === "/auth/verify-email" &&
        User_Role
      ) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(User_Role), request.url),
        );
      }
      // nedd password change
      if (userinfo.needPasswordChange) {
        if (pathName !== "/auth/reset-password") {
          const resetPasswordUrl = new URL("/auth/reset-password", request.url);
          resetPasswordUrl.searchParams.set("email", userinfo.email);
          return NextResponse.redirect(resetPasswordUrl);
        }

        return NextResponse.next();
      }
      if (
        !userinfo.needPasswordChange &&
        pathName === "/auth/reset-password" &&
        User_Role
      ) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(User_Role), request.url),
        );
      }
    }
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }
    if (routeOwner === "ADMIN" || routeOwner === "USER") {
      if (routeOwner !== User_Role) {
        if (User_Role) {
          return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(User_Role), request.url),
          );
        }
      }
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return NextResponse.next();
  }
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
