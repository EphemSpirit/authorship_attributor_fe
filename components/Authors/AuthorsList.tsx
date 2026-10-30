"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Author from "@/app/types/author"
import { deleteAuthor } from "@/utils/author_actions"
import AuthorSlideout from "./AuthorSlideout"
import DeleteAuthorModal from "./DeleteAuthorModal"

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}…` : text

const AuthorsList = ({ authors }: { authors: Author[] }) => {
  const [authorFormOpen, setAuthorFormOpen] = useState(false)
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null)
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, startDeleteTransition] = useTransition()
  const editingAuthor = authors.find((author) => author.id === editingAuthorId)

  const openAuthorForm = (authorId: number | null) => {
    setEditingAuthorId(authorId)
    setAuthorFormOpen(true)
  }



  const confirmDelete = (id: number) => {
    startDeleteTransition(async () => {
      const result = await deleteAuthor(id)
      if (!result.success) setDeleteError(result.error)
      startDeleteTransition(() => {
        setDeletingAuthor(null)
        setDeleteError(null)
      })
    })
  }

  return (
    <>
      <div className="flex items-center justify-center underline">
        <h2 className="font-bold text-2xl">Authors</h2>
      </div>
      <div className="mr-4 mt-4 ml-auto flex w-fit border border-black rounded-lg">
        <button
          type="button"
          onClick={() => openAuthorForm(null)}
          className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900 cursor-pointer"
        >
          New Author
        </button>
      </div>
      {authorFormOpen && (
        <AuthorSlideout isOpen={authorFormOpen} setIsOpen={setAuthorFormOpen} author={editingAuthor} />
      )}
      {deletingAuthor && (
        <DeleteAuthorModal
          author={deletingAuthor}
          onCancel={() => setDeletingAuthor(null)}
          onConfirm={confirmDelete}
        />
      )}
      {deleteError && <p className="mx-4 mt-4 text-red-800">{deleteError}</p>}
      <div className="m-4 overflow-hidden rounded-lg border border-black">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="divide-x divide-white/20 bg-black text-white">
              <th className="p-3 font-bold">Name</th>
              <th className="p-3 font-bold">Age</th>
              <th className="p-3 font-bold">Bio</th>
              <th className="p-3 font-bold">Style Profile</th>
              <th className="p-3 font-bold">Edit</th>
              <th className="p-3 font-bold">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 bg-white text-black">
            {authors.map((author) => (
              <tr
                key={author.name}
                className="divide-x divide-black/10 odd:bg-white even:bg-red-50 hover:bg-red-100"
              >
                <td className="p-3">{author.name}</td>
                <td className="p-3">{author.author_metadata.age}</td>
                <td className="p-3">{truncate(author.author_metadata.bio, 50)}</td>
                <td className="p-3">
                  {!!author.style_profiles.length ? (
                    <Link href={`/authors/${author.id}`} className="font-bold text-red-800 hover:underline">
                      View Profile
                    </Link>
                  ) : (
                    <p>No Profile Generated Yet</p>
                  )}
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => openAuthorForm(author.id)}
                    className="font-bold text-red-800 hover:underline cursor-pointer"
                  >
                    Edit Author
                  </button>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => setDeletingAuthor(author)}
                    disabled={isDeleting}
                    className="font-bold text-red-800 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Delete Author
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AuthorsList