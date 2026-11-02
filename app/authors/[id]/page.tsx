import { getAuthorById } from "@/utils/author_actions"
import AuthorShow from "@/components/Authors/AuthorShow"

const AuthorPage = async ({ params }: PageProps<"/authors/[id]">) => {
  const { id } = await params
  const author = await getAuthorById(Number(id))
  return (
    <AuthorShow author={author} />
  )
}

export default AuthorPage
