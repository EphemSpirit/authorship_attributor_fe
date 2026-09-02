export default function Header() {
  return (
    <header className="mb-10 flex w-full items-center justify-between bg-black px-6 py-4 text-white">
      <h1 className="text-3xl font-bold">Authorship Attributor</h1>
      <nav className="flex gap-6 text-sm font-bold">
        <a href="#" className="hover:underline">
          Manage Authors
        </a>
        <a href="#" className="hover:underline">
          Upload a Document
        </a>
      </nav>
    </header>
  )
}
