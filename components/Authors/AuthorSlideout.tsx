"use client"

import { useActionState } from "react"
import Author from "@/app/types/author"
import { createAuthor, updateAuthor, AuthorFormState } from "@/utils/author_actions"

const initialState: AuthorFormState = { success: false, error: null }

interface AuthorSlideoutProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  author?: Author
}

const AuthorSlideout = ({ isOpen, setIsOpen, author }: AuthorSlideoutProps) => {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: AuthorFormState, formData: FormData) => {
      const result = author ? await updateAuthor(author.id, formData) : await createAuthor(formData)
      if (result.success) setIsOpen(false)
      return result
    },
    initialState
  )

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        inert={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-fit flex-col border-l border-black bg-white p-6 text-black shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="mb-6 flex items-center justify-between gap-8">
          <h3 className="text-xl font-bold">{author ? "Edit Author" : "New Author"}</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-2xl leading-none hover:text-red-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            Name
            <input
              type="text"
              name="name"
              defaultValue={author?.name}
              required
              className="rounded-lg border border-black px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1">
            Age
            <input
              type="number"
              name="age"
              defaultValue={author?.author_metadata.age}
              min={0}
              required
              className="rounded-lg border border-black px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1">
            Bio
            <textarea
              name="bio"
              defaultValue={author?.author_metadata.bio}
              rows={5}
              className="rounded-lg border border-black px-3 py-2 font-normal"
            />
          </label>

          {state.error && <p className="text-red-800">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900 disabled:opacity-50"
          >
            {isPending ? "Saving…" : author ? "Update Author" : "Create Author"}
          </button>
        </form>
      </aside>
    </>
  )
}

export default AuthorSlideout
