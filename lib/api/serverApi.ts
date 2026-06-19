import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const PER_PAGE = 12;

interface NoteSearch {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  searchQuery: string = "", 
  pageNumber: number = 1, 
  tag?: string
): Promise<NoteSearch> {
  const cookieStore = await cookies(); 
  
  const params: Record<string, string | number> = {
    page: pageNumber,
    perPage: PER_PAGE,
  };

  if (searchQuery) params.search = searchQuery;
  if (tag && tag !== 'all') params.tag = tag;

  const { data } = await api.get<NoteSearch>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const cookieStore = await cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function checkSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const { data } = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}
