"use client"

import { useState } from "react"
import UploadTypeModal from "./UploadTypeModal"

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="cursor-pointer font-bold hover:underline">
        Upload a Document
      </button>
      {isOpen && <UploadTypeModal onClose={() => setIsOpen(false)} />}
    </>
  )
}

export default UploadButton