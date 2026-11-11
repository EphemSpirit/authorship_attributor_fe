import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import KnownDocumentForm from './KnownDocumentForm'
import { uploadKnownDocuments } from '@/utils/upload_actions'

// Mock the server action so no real request is sent to the API.
jest.mock('@/utils/upload_actions', () => ({
  uploadKnownDocuments: jest.fn(),
}))

const mockUpload = uploadKnownDocuments as jest.Mock

const fillAndSubmit = () => {
  const file = new File(['hello'], 'doc.txt', { type: 'text/plain' })
  fireEvent.change(screen.getByLabelText('Documents'), { target: { files: [file] } })
  fireEvent.change(screen.getByLabelText(/Author Names/), { target: { value: 'Jane Austen' } })
  // jsdom's constraint validation doesn't see fake files on a required input,
  // so submit the form directly rather than clicking the button.
  fireEvent.submit(screen.getByRole('button', { name: 'Upload' }).closest('form')!)
}

describe('KnownDocumentForm', () => {
  beforeEach(() => mockUpload.mockReset())

  it('shows a spinner and disables the button while uploading', async () => {
    let resolveUpload: (value: { error: string | null }) => void = () => {}
    mockUpload.mockReturnValue(new Promise((resolve) => { resolveUpload = resolve }))
    render(<KnownDocumentForm />)

    fillAndSubmit()

    expect(await screen.findByRole('status', { name: 'Uploading' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Uploading/ })).toBeDisabled()

    // Settle the action so the pending transition doesn't leak into later tests.
    resolveUpload({ error: null })
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('shows an error message when the upload fails', async () => {
    mockUpload.mockResolvedValue({ error: 'Something went wrong. Please try again.' })
    render(<KnownDocumentForm />)

    fillAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('does not show an error before submission', () => {
    render(<KnownDocumentForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})