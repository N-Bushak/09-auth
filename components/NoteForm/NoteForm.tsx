"use client";

import css from "./NoteForm.module.css";
import { useId, useState } from "react";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useNoteStore from "@/lib/store/noteStore";

interface NewNote {
  title: string;
  content: string;
  tag: string;
}

export default function NoteForm() {
  const fieldID = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [errors, setErrors] = useState<Partial<NewNote>>({});

  const mutation = useMutation({
    mutationFn: (payload: NewNote) => createNote(payload),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
    onError: (error: Error) => {
      alert(`Failed to create note: ${error.message}`);
    },
  });

  function validate(data: NewNote): Partial<NewNote> {
    const errs: Partial<NewNote> = {};
    if (!data.title || data.title.length < 3) errs.title = "Title too short";
    if (data.title && data.title.length > 50) errs.title = "Title too long";
    if (!data.content) errs.content = "Content is required";
    if (data.content && data.content.length > 500)
      errs.content = "Content is too long";
    if (!data.tag) errs.tag = "Tag is required";
    return errs;
  }

  function formAction(formData: FormData) {
    const data: NewNote = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    mutation.mutate(data);
  }

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldID}-title`}>Title</label>
        <input
          id={`${fieldID}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldID}-content`}>Content</label>
        <textarea
          id={`${fieldID}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldID}-tag`}>Tag</label>
        <select
          id={`${fieldID}-tag`}
          name="tag"
          className={css.input}
          defaultValue={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}