"use server"

import { revalidatePath } from "next/cache"

export type CreateAuthorState = {
  success: boolean
  error: string | null
}

export const createAuthor = async (formData: FormData): Promise<CreateAuthorState> => {
  const name = String(formData.get("name") ?? "").trim()
  const age = Number(formData.get("age"))
  const bio = String(formData.get("bio") ?? "").trim()

  if (!name) return { success: false, error: "Name is required" }
  if (!Number.isInteger(age) || age < 0) return { success: false, error: "Age must be a whole number" }

  const res = await fetch(`${process.env.FASTAPI_URL}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, author_metadata: { age, bio } }),
  })

  if (!res.ok) return { success: false, error: "Failed to create author" }

  revalidatePath("/authors")
  return { success: true, error: null }
}

import Author from "@/app/types/author"

export const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors`)
  return res.json()
}

export const getAuthorById = async (id: number): Promise<Author> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors/${id}`)
  return res.json()
}
