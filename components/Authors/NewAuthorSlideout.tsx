"use client"

import { useActionState } from "react"
import { createAuthor, CreateAuthorState } from "@/utils/author_actions"

const initialState: CreateAuthorState = { success: false, error: null }

const NewAuthorSlideout = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: CreateAuthorState, formData: FormData) => {
      const result = await createAuthor(formData)
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
          <h3 className="text-xl font-bold">New Author</h3>
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
              required
              className="rounded-lg border border-black px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1">
            Age
            <input
              type="number"
              name="age"
              min={0}
              required
              className="rounded-lg border border-black px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1">
            Bio
            <textarea
              name="bio"
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
            {isPending ? "Saving…" : "Create Author"}
          </button>
        </form>
      </aside>
    </>
  )
}

export default NewAuthorSlideout
