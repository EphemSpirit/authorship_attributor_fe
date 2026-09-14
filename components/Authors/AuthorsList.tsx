import Link from "next/link"
import Author from "@/app/types/author"

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}…` : text

const AuthorsList = ({ authors }: { authors: Author[] }) => {
  return (
    <>
      <div className="flex items-center justify-center underline">
        <h2 className="font-bold text-2xl">Authors</h2>
      </div>
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
                  <Link href="#" className="font-bold text-red-800 hover:underline">
                    View Profile
                  </Link>
                </td>
                <td className="p-3">
                  <Link href="#" className="font-bold text-red-800 hover:underline">
                    Edit Author
                  </Link>
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