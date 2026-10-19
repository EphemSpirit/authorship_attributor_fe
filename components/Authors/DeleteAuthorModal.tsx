"use client"

import Author from "@/app/types/author"

interface DeleteAuthorModalProps {
  author: Author
  onCancel: () => void
  onConfirm: (id: number) => void
}

const DeleteAuthorModal = ({ author, onCancel, onConfirm }: DeleteAuthorModalProps) => {
  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 z-40 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-author-title"
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-black bg-white p-6 text-black shadow-xl"
      >
        <h3 id="delete-author-title" className="mb-4 text-xl font-bold">
          Delete Author
        </h3>
        <p className="mb-6">
          Are you sure you want to delete <span className="font-bold">{author.name}</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black px-4 py-2 font-bold hover:bg-red-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(author.id)}
            className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}

export default DeleteAuthorModal