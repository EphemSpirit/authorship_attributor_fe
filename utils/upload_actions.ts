"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type UploadFormState = {
  error: string | null
}

const GENERIC_ERROR = "Something went wrong. Please try again."

export const uploadKnownDocuments = async (
  _prevState: UploadFormState,
  formData: FormData
): Promise<UploadFormState> => {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0)
  const authorNames = String(formData.get("authors") ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)

  if (files.length === 0) return { error: "Please select at least one document." }
  if (authorNames.length === 0) return { error: "Please enter at least one author name." }

  // The API expects author_names as repeated query params: ?author_names=A&author_names=B
  const query = new URLSearchParams()
  for (const name of authorNames) query.append("author_names", name)
  const url = `${process.env.FASTAPI_URL}/documents/upload-known?${query}`

  // The endpoint accepts one file per request. Upload sequentially so concurrent
  // requests don't race to create the same new author.
  for (const file of files) {
    const body = new FormData()
    body.append("file", file)

    try {
      const res = await fetch(url, { method: "POST", body })
      if (!res.ok) return { error: GENERIC_ERROR }
    } catch {
      return { error: GENERIC_ERROR }
    }
  }

  revalidatePath("/authors")
  redirect("/authors")
}