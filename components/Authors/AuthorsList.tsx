"use client"

import { useState } from "react"
import Link from "next/link"
import Author from "@/app/types/author"
import AuthorSlideout from "./AuthorSlideout"

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}…` : text

const AuthorsList = ({ authors }: { authors: Author[] }) => {
  const [authorFormOpen, setAuthorFormOpen] = useState(false)
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null)
  const editingAuthor = authors.find((author) => author.id === editingAuthorId)

  const openAuthorForm = (authorId: number | null) => {
    setEditingAuthorId(authorId)
    setAuthorFormOpen(true)
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
      <div className="m-4 overflow-hidden rounded-lg border border-black">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="divide-x divide-white/20 bg-black text-white">
              <th className="p-3 font-bold">Name</th>
              <th className="p-3 font-bold">Age</th>
              <th className="p-3 font-bold">Bio</th>
              <th className="p-3 font-bold">Style Profile</th>
              <th className="p-3 font-bold">Edit</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AuthorsList