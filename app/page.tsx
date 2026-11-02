import Card from '@/components/Card'

export default function Home() {
  return (
    <main className="flex min-w-screen flex-col items-center font-xl">
      <section className="flex w-5/6 flex-col items-center pt-4 text-center">
        <div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <Card href="/authors" title="1. Manage Authors">
            Create, view, edit, and delete authors in the database.
          </Card>

          <Card href="#" title="2. Add a Known Document">
            Upload a document along with one or more author names. This
            creates the author(s) if they don&apos;t already exist and
            associates the document with them, growing the corpus used for
            attribution.
          </Card>

          <Card href="#" title="3. Attribute a Disputed Document">
            Upload a document of unknown or disputed authorship. The API
            returns the 5 most likely author candidates, each with a
            confidence score.
          </Card>
        </div>

        <div className="w-full pt-10 text-left flex flex-col justify-center items-center">
          <div className="font-bold pb-2">How to Use</div>
          <ol className="list-decimal list-inside space-y-1 text-sm text-black">
            <li>Add authors, either directly or by uploading known documents on their behalf.</li>
            <li>Repeat for each author you want included in the attribution pool.</li>
            <li>Upload a disputed document to see the top 5 candidate authors and their confidence scores.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
