import { cookies } from "next/headers"
import { number } from "zod";

const setCookie = async (token: string, key: string, maxAge?: number) => {
  const cookieStore = await cookies();
  cookieStore.set(key, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: maxAge,
  })
};

const getCookie = async (key :string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

export const cookieUtils = {
  getCookie,
  deleteCookie,
  setCookie
}