import Author from "@/app/types/author"

const AuthorsList = ({ authors }: { authors: Author[] }) => {
  return (
    <div>AUTHORS GO HERE: {authors[0].name}</div>
  )
}

export default AuthorsList