import { isAxiosError } from "axios";
import { api } from "./api";
import type { User } from "@/types/user";
import type { NewNote, Note } from "@/types/note"; 

const PER_PAGE = 12;

interface NoteSearch {
  notes: Note[];
  totalPages: number;
}

const formatTag = (tag: string): string => {
  const trimmed = tag.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};


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

export async function fetchNotes(searchQuery: string, pageNumber: number, tag?: string): Promise<NoteSearch> {
  const params: Record<string, string | number> = {
    page: pageNumber,
    perPage: PER_PAGE,
  };

  if (searchQuery) params.search = searchQuery;
  if (tag && tag !== 'all') params.tag = tag;

  const { data } = await api.get<NoteSearch>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNoteContent: NewNote): Promise<Note> {
  const payload = {
    title: newNoteContent.title.trim(),
    content: newNoteContent.content.trim(),
    tag: formatTag(newNoteContent.tag), 
  };

  try {
    const { data } = await api.post<Note>('/notes', payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Validation failed");
    }
    throw error;
  }
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}