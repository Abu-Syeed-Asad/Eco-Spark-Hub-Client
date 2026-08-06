/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";

const veryfyToken = (token: string, secret: string) => {
  try {
    const verify_token = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: verify_token
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error
    }
  }
};
const decodedToken = (token:string) => {
  const decode_token = jwt.decode(token) as JwtPayload;
  return decode_token;
}

export const jwtUtils = {
  veryfyToken,
  decodedToken,
}