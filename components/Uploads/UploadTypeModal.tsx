"use client"

import Link from "next/link"

interface UploadTypeModalProps {
  onClose: () => void
}

const UploadTypeModal = ({ onClose }: UploadTypeModalProps) => {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-type-title"
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-black bg-white p-6 text-base font-normal text-black shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between gap-8">
          <h3 id="upload-type-title" className="text-xl font-bold">
            Upload a Document
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-2xl leading-none hover:text-red-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="mb-6">Is the authorship of the document(s) known?</p>
        <div className="flex justify-end gap-4">
          <Link
            href="/uploads/unknown"
            onClick={onClose}
            className="rounded-lg border border-black px-4 py-2 font-bold hover:bg-red-50"
          >
            No, it&apos;s unknown
          </Link>
          <Link
            href="/uploads/known"
            onClick={onClose}
            className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-900"
          >
            Yes, it&apos;s known
          </Link>
        </div>
      </div>
    </>
  )
}

export default UploadTypeModal