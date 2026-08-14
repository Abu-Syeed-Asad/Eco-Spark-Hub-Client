const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const setBrowserCookie = (
  key: string,
  token: string,
  maxAge = 60 * 60 * 24,
) => {
  const encodedKey = encodeURIComponent(key);
  const encodedValue = encodeURIComponent(token);
  const secureFlag = cookieOptions.secure ? "; Secure" : "";

  document.cookie = `${encodedKey}=${encodedValue}; path=${cookieOptions.path}; max-age=${maxAge}; SameSite=${cookieOptions.sameSite}${secureFlag}`;
};

const getBrowserCookie = (key: string) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${encodeURIComponent(key)}=`));

  return cookieValue
    ? decodeURIComponent(cookieValue.split("=").slice(1).join("="))
    : undefined;
};

const deleteBrowserCookie = (key: string) => {
  document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const setCookie = async (key: string, token: string, maxAge = 60 * 60 * 24) => {
  if (typeof window !== "undefined") {
    setBrowserCookie(key, token, maxAge);
    return;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  cookieStore.set(key, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  });
};

const getCookie = async (key: string) => {
  if (typeof window !== "undefined") {
    return getBrowserCookie(key);
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
};

const deleteCookie = async (key: string) => {
  if (typeof window !== "undefined") {
    deleteBrowserCookie(key);
    return;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

export const cookieUtils = {
  getCookie,
  deleteCookie,
  setCookie,
};
