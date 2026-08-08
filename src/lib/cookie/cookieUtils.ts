
import { cookies } from "next/headers"


const setCookie = async ( key: string,token:string, maxAge=60*60*24) => {
  const cookieStore = await cookies();
  cookieStore.set(key, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
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