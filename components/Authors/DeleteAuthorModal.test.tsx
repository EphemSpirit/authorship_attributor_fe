import { render, screen, fireEvent } from '@testing-library/react'
import DeleteAuthorModal from './DeleteAuthorModal'
import Author from '@/app/types/author'

// DeleteAuthorModal doesn't import any server actions itself — the parent
// passes in onCancel/onConfirm. Mocking those callbacks means no real delete
// ever fires.

const author: Author = {
  id: 7,
  name: 'Ursula K. Le Guin',
  author_metadata: { age: 88, bio: 'Writes things.' },
  style_profiles: [],
}

const renderModal = () => {
  const onCancel = jest.fn()
  const onConfirm = jest.fn()
  const utils = render(<DeleteAuthorModal author={author} onCancel={onCancel} onConfirm={onConfirm} />)
  return { ...utils, onCancel, onConfirm }
}

describe('DeleteAuthorModal', () => {
  describe('rendering', () => {
    it('renders an accessible modal dialog labelled by its heading', () => {
      renderModal()

      const dialog = screen.getByRole('dialog', { name: 'Delete Author' })
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(screen.getByRole('heading', { name: 'Delete Author' })).toBeInTheDocument()
    })

    it("asks for confirmation using the author's name", () => {
      renderModal()

      expect(screen.getByRole('dialog')).toHaveTextContent(
        `Are you sure you want to delete ${author.name}? This cannot be undone.`
      )
      expect(screen.getByText(author.name)).toHaveClass('font-bold')
    })

    it('renders Cancel and Delete buttons', () => {
      renderModal()

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })

    it('does not call either callback on render', () => {
      const { onCancel, onConfirm } = renderModal()

      expect(onCancel).not.toHaveBeenCalled()
      expect(onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('interactions', () => {
    it("calls onConfirm with the author's id when Delete is clicked", () => {
      const { onCancel, onConfirm } = renderModal()

      fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

      expect(onConfirm).toHaveBeenCalledTimes(1)
      expect(onConfirm).toHaveBeenCalledWith(author.id)
      expect(onCancel).not.toHaveBeenCalled()
    })

    it('calls onCancel when Cancel is clicked', () => {
      const { onCancel, onConfirm } = renderModal()

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(onCancel).toHaveBeenCalledTimes(1)
      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('calls onCancel when the backdrop is clicked', () => {
      const { container, onCancel, onConfirm } = renderModal()

      fireEvent.click(container.firstChild as HTMLElement)

      expect(onCancel).toHaveBeenCalledTimes(1)
      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('does not call onCancel when clicking inside the dialog', () => {
      const { onCancel, onConfirm } = renderModal()

      fireEvent.click(screen.getByRole('dialog'))

      expect(onCancel).not.toHaveBeenCalled()
      expect(onConfirm).not.toHaveBeenCalled()
    })
  })
})