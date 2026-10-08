import { getAuthorById } from "@/utils/author_utils"
import AuthorShow from "@/components/Authors/AuthorShow"

const AuthorPage = async ({ params }: any) => {
  const author = await getAuthorById(params.id)
  return (
    <AuthorShow author={author} />
  )
}

export default AuthorPage