import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";

export async function fetchNotes() {
  const cookieStore = cookies();
  const { data } = await api.get("/notes", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const cookieStore = cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieStore = cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function checkSession(): Promise<User | null> {
  const cookieStore = cookies();
  const { data } = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}
