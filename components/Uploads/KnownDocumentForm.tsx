"use client"

const KnownDocumentForm = () => {
  return (
    <form className="flex w-full max-w-lg flex-col gap-4 text-black">
      <label className="flex flex-col gap-1 font-bold">
        Documents
        <input
          type="file"
          name="files"
          multiple
          required
          className="rounded-lg border border-black px-3 py-2 font-normal file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-800 file:px-3 file:py-1 file:font-bold file:text-white hover:file:bg-red-900"
        />
      </label>

      <label className="flex flex-col gap-1 font-bold">
        Author Names
        <input
          type="text"
          name="authors"
          required
          placeholder="Jane Austen, Charlotte Brontë"
          className="rounded-lg border border-black px-3 py-2 font-normal"
        />
        <span className="text-sm font-normal">Separate multiple authors with commas.</span>
      </label>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900 disabled:opacity-50"
      >
        Upload
      </button>
    </form>
  )
}

export default KnownDocumentForm