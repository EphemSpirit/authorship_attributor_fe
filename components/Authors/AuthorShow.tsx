import Author from "@/app/types/author"

interface AuthorShowProps {
  author: Author
}

const AuthorShow = ({ author }: AuthorShowProps) => {
  return (
    <div>AuthorShow for author: {author.name}</div>
  )
}

export default AuthorShow