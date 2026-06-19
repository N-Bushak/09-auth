import { api } from "./api";
import { User } from "@/types/user";

export async function register(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(user: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", user);
  return data;
}

export async function fetchNotes() {
  const { data } = await api.get("/notes");
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: string;
}) {
  const { data } = await api.post("/notes", note);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
}
