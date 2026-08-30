export default function Home() {
  return (
    <main className="flex min-w-screen flex-col items-center p-24 font-xl">
      <section className="flex w-full max-w-4xl flex-col items-center text-center">
        <h1 className="text-3xl font-bold pb-3">Authorship Attributor</h1>
        <p className="text-lg text-gray-600 pb-10">
          Build an author corpus, then find out who most likely wrote a
          disputed document.
        </p>

        <div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="font-bold pb-2">1. Manage Authors</div>
            <p className="text-sm text-gray-600">
              Create, view, edit, and delete authors in the database.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <div className="font-bold pb-2">2. Add a Known Document</div>
            <p className="text-sm text-gray-600">
              Upload a document along with one or more author names. This
              creates the author(s) if they don&apos;t already exist and
              associates the document with them, growing the corpus used for
              attribution.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <div className="font-bold pb-2">3. Attribute a Disputed Document</div>
            <p className="text-sm text-gray-600">
              Upload a document of unknown or disputed authorship. The API
              returns the 5 most likely author candidates, each with a
              confidence score.
            </p>
          </div>
        </div>

        <div className="w-full pt-10 text-left">
          <div className="font-bold pb-2">How to Use</div>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Add authors, either directly or by uploading known documents on their behalf.</li>
            <li>Repeat for each author you want included in the attribution pool.</li>
            <li>Upload a disputed document to see the top 5 candidate authors and their confidence scores.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
