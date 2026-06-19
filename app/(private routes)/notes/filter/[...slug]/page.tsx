import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug.length > 0 ? slug[0] : "all";
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `${formattedTag} Notes | NoteHub`,
    description: `Browse all notes filtered by tag: ${formattedTag}`,
    openGraph: {
      title: `${formattedTag} Notes | NoteHub`,
      description: `Browse all notes filtered by tag: ${formattedTag}`,
      url: `https://08-zustand-one-sooty.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub app preview",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug.length > 0 ? slug[0] : "all";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}