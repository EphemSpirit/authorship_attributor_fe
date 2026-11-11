"use client"

import { useActionState } from "react"
import { uploadKnownDocuments, UploadFormState } from "@/utils/upload_actions"

const initialState: UploadFormState = { error: null }

const KnownDocumentForm = () => {
  const [state, formAction, pending] = useActionState(uploadKnownDocuments, initialState)

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4 text-black">
      <label className="flex flex-col gap-1 font-bold">
        Documents
        <input
          type="file"
          name="files"
          multiple
          required
          disabled={pending}
          className="rounded-lg border border-black px-3 py-2 font-normal file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-800 file:px-3 file:py-1 file:font-bold file:text-white hover:file:bg-red-900"
        />
      </label>

      <label className="flex flex-col gap-1 font-bold">
        Author Names
        <input
          type="text"
          name="authors"
          required
          disabled={pending}
          placeholder="Jane Austen, Charlotte Brontë"
          className="rounded-lg border border-black px-3 py-2 font-normal"
        />
        <span className="text-sm font-normal">Separate multiple authors with commas.</span>
      </label>

      {state.error && !pending && (
        <p role="alert" className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && (
          <span
            role="status"
            aria-label="Uploading"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
        )}
        {pending ? "Uploading..." : "Upload"}
      </button>
    </form>
  )
}

export default KnownDocumentForm