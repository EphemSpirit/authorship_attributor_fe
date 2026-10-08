"use server"

import { revalidatePath } from "next/cache"

export type AuthorFormState = {
  success: boolean
  error: string | null
}

const parseAuthorForm = (formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim()
  const age = Number(formData.get("age"))
  const bio = String(formData.get("bio") ?? "").trim()

  if (!name) return { error: "Name is required" }
  if (!Number.isInteger(age) || age < 0) return { error: "Age must be a whole number" }

  return { body: JSON.stringify({ name, author_metadata: { age, bio } }) }
}

export const createAuthor = async (formData: FormData): Promise<AuthorFormState> => {
  const { body, error } = parseAuthorForm(formData)
  if (error) return { success: false, error }

  const res = await fetch(`${process.env.FASTAPI_URL}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  if (!res.ok) return { success: false, error: "Failed to create author" }

  revalidatePath("/authors")
  return { success: true, error: null }
}

export const updateAuthor = async (id: number, formData: FormData): Promise<AuthorFormState> => {
  const { body, error } = parseAuthorForm(formData)
  if (error) return { success: false, error }

  const res = await fetch(`${process.env.FASTAPI_URL}/authors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  })

  if (!res.ok) return { success: false, error: "Failed to update author" }

  revalidatePath("/authors")
  revalidatePath(`/authors/${id}`)
  return { success: true, error: null }
}

import Author from "@/app/types/author"

export const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors`)
  const authors: Author[] = await res.json()
  return authors.sort((a, b) => a.id - b.id)
}

export const getAuthorById = async (id: number): Promise<Author> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors/${id}`)
  return res.json()
}
