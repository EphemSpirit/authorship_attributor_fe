import KnownDocumentForm from "@/components/Uploads/KnownDocumentForm"

const KnownAuthorDocumentUpload = () => {
  return (
    <main className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Add Known Documents</h2>
      <KnownDocumentForm />
    </main>
  )
}

export default KnownAuthorDocumentUpload