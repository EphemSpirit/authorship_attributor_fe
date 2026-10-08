import AuthorsList from "@/components/Authors/AuthorsList"
import { fetchAuthors } from "@/utils/author_actions"


async function AuthorsPage() {
  const authors = await fetchAuthors()
  return (
    <AuthorsList authors={authors} />
  )
}

export default AuthorsPage