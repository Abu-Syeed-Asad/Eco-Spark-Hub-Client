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
const refreshTokenMiddleWare = async (refreshToken: string) => {
  try {
    const refresh = await getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(`Error refreshing token in proxy middleware `, error);
    return false;
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
      request.cookies.get("access_token")?.value || parsedCookies.accessToken;
    const refreshToken =
      request.cookies.get("refresh_token")?.value || parsedCookies.refreshToken;
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

    if (
      isValidAccesstoken &&
      refreshToken &&
      tokenUtils.isTokenExpiringSoon(accessToken)
    ) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleWare(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
      return response;
    }
    //  redirection
    if (isAuth && isValidAccesstoken && User_Role) {
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
