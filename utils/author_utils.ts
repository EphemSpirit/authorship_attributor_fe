import Author from "@/app/types/author"

export const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors`)
  return res.json()
}

export const getAuthorById = async (id: number): Promise<Author> => {
  const res = await fetch(`${process.env.FASTAPI_URL}/authors/${id}`)
  return res.json()
}