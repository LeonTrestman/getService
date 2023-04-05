import { signOut } from "next-auth/react";

//Signout off nextAuth if 401 is returned from the server
const fetchAuthed = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> => {
  const res = await fetch(input, init);

  if (res.status === 401) {
    await signOut({ callbackUrl: "http://localhost:3000" });
    return Promise.reject(new Error("Unauthorized"));
  }

  return res;
};

export default fetchAuthed;
