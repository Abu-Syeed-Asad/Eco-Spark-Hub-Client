/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../jwt/jwtUtils";
import { cookieUtils } from "../cookie/cookieUtils";

const getTokenSecondsRemaining = (token: string): number => {
  if (!token) {
    return 0;
  }
  try {
    const tokenPayload = jwtUtils.decodedToken(token) as JwtPayload;
    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }
    const remainingTime = (tokenPayload.exp as number) - (Math.floor(Date.now() / 1000));
    return remainingTime > 0 ? remainingTime : 0;
  } catch (error:any) {
    return 0
  }
}
 
const isTokenExpiringSoon = (token:string , threshouldInSecond=600):boolean => {
  const remainingSecound = getTokenSecondsRemaining(token);
  return remainingSecound > 0 && remainingSecound <= threshouldInSecond;
}

const setTokenInCookie = async (name: string, toke: string, fallbackMaxAgeInSecond: number = 60 * 60 * 24) => {
  let maxAgeInSecond;
  if (name !== "better-auth.session_token") {
    maxAgeInSecond = getTokenSecondsRemaining(toke);
  }
  await cookieUtils.setCookie(name, toke, maxAgeInSecond || fallbackMaxAgeInSecond)
};

const isTokenExpired = async (token: string): Promise<boolean> => {
  const remainingSecound = getTokenSecondsRemaining(token);
  return remainingSecound === 0;
}

export const tokenUtils ={
  getTokenSecondsRemaining,
  isTokenExpiringSoon,
  setTokenInCookie,
  isTokenExpired
}
