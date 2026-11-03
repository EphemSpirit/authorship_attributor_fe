import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthorSlideout from './AuthorSlideout'
import Author from '@/app/types/author'
import { createAuthor, updateAuthor } from '@/utils/author_actions'

// Replace the server actions with mocks so no network requests or
// revalidation ever happen during tests.
jest.mock('@/utils/author_actions', () => ({
  createAuthor: jest.fn(),
  updateAuthor: jest.fn(),
}))

const mockCreateAuthor = createAuthor as jest.MockedFunction<typeof createAuthor>
const mockUpdateAuthor = updateAuthor as jest.MockedFunction<typeof updateAuthor>

const author: Author = {
  id: 7,
  author_metadata: {
    age: 42,
    bio: 'Writes things.',
  },
  name: 'Ursula K. Le Guin',
  style_profiles: [],
}

const renderSlideout = (props: Partial<React.ComponentProps<typeof AuthorSlideout>> = {}) => {
  const setIsOpen = jest.fn()
  const utils = render(<AuthorSlideout isOpen setIsOpen={setIsOpen} {...props} />)
  return { ...utils, setIsOpen }
}

const nameInput = () => screen.getByRole('textbox', { name: /name/i }) as HTMLInputElement
const ageInput = () => screen.getByRole('spinbutton', { name: /age/i }) as HTMLInputElement
const bioInput = () => screen.getByRole('textbox', { name: /bio/i }) as HTMLTextAreaElement

const fillForm = ({ name, age, bio }: { name: string; age: string; bio: string }) => {
  fireEvent.change(nameInput(), { target: { value: name } })
  fireEvent.change(ageInput(), { target: { value: age } })
  fireEvent.change(bioInput(), { target: { value: bio } })
}

describe('AuthorSlideout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create mode (no author)', () => {
    it('renders the "New Author" heading and a create button', () => {
      renderSlideout()

      expect(screen.getByRole('heading', { name: 'New Author' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Author' })).toBeInTheDocument()
    })

    it('renders empty form fields', () => {
      renderSlideout()

      expect(nameInput()).toHaveValue('')
      expect(ageInput()).toHaveValue(null)
      expect(bioInput()).toHaveValue('')
    })
  })

  describe('edit mode (author provided)', () => {
    it('renders the "Edit Author" heading and an update button', () => {
      renderSlideout({ author })

      expect(screen.getByRole('heading', { name: 'Edit Author' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Update Author' })).toBeInTheDocument()
    })

    it("prepopulates the form with the author's data", () => {
      renderSlideout({ author })

      expect(nameInput()).toHaveValue(author.name)
      expect(ageInput()).toHaveValue(author.author_metadata.age)
      expect(bioInput()).toHaveValue(author.author_metadata.bio)
    })
  })

  describe('submitting', () => {
    it('does not call any action on render', () => {
      renderSlideout()
      renderSlideout({ author })

      expect(mockCreateAuthor).not.toHaveBeenCalled()
      expect(mockUpdateAuthor).not.toHaveBeenCalled()
    })

    it('calls createAuthor with the form data when creating, then closes on success', async () => {
      mockCreateAuthor.mockResolvedValue({ success: true, error: null })
      const { setIsOpen } = renderSlideout()

      fillForm({ name: 'Octavia Butler', age: '58', bio: 'Speculative fiction.' })
      fireEvent.click(screen.getByRole('button', { name: 'Create Author' }))

      await waitFor(() => expect(mockCreateAuthor).toHaveBeenCalledTimes(1))
      expect(mockUpdateAuthor).not.toHaveBeenCalled()

      const formData = mockCreateAuthor.mock.calls[0][0]
      expect(formData.get('name')).toBe('Octavia Butler')
      expect(formData.get('age')).toBe('58')
      expect(formData.get('bio')).toBe('Speculative fiction.')

      await waitFor(() => expect(setIsOpen).toHaveBeenCalledWith(false))
    })

    it("calls updateAuthor with the author's id and form data when editing, then closes on success", async () => {
      mockUpdateAuthor.mockResolvedValue({ success: true, error: null })
      const { setIsOpen } = renderSlideout({ author })

      fireEvent.change(nameInput(), { target: { value: 'Ursula Le Guin' } })
      fireEvent.click(screen.getByRole('button', { name: 'Update Author' }))

      await waitFor(() => expect(mockUpdateAuthor).toHaveBeenCalledTimes(1))
      expect(mockCreateAuthor).not.toHaveBeenCalled()

      const [id, formData] = mockUpdateAuthor.mock.calls[0]
      expect(id).toBe(author.id)
      expect(formData.get('name')).toBe('Ursula Le Guin')
      expect(formData.get('age')).toBe(String(author.author_metadata.age))
      expect(formData.get('bio')).toBe(author.author_metadata.bio)

      await waitFor(() => expect(setIsOpen).toHaveBeenCalledWith(false))
    })

    it('shows the error and stays open when the action fails', async () => {
      mockCreateAuthor.mockResolvedValue({ success: false, error: 'Failed to create author' })
      const { setIsOpen } = renderSlideout()

      fillForm({ name: 'Octavia Butler', age: '58', bio: '' })
      fireEvent.click(screen.getByRole('button', { name: 'Create Author' }))

      expect(await screen.findByText('Failed to create author')).toBeInTheDocument()
      expect(setIsOpen).not.toHaveBeenCalled()
    })

    it('disables the submit button and shows a pending label while saving', async () => {
      let resolveAction!: (value: { success: boolean; error: string | null }) => void
      mockCreateAuthor.mockImplementation(
        () => new Promise((resolve) => { resolveAction = resolve })
      )
      renderSlideout()

      fillForm({ name: 'Octavia Butler', age: '58', bio: '' })
      fireEvent.click(screen.getByRole('button', { name: 'Create Author' }))

      const pendingButton = await screen.findByRole('button', { name: 'Saving…' })
      expect(pendingButton).toBeDisabled()

      resolveAction({ success: true, error: null })

      expect(await screen.findByRole('button', { name: 'Create Author' })).toBeEnabled()
    })

    it('does not submit when required fields are empty', async () => {
      renderSlideout()

      fireEvent.click(screen.getByRole('button', { name: 'Create Author' }))

      // Give any (unexpected) async submission a chance to run.
      await new Promise((r) => setTimeout(r, 0))
      expect(mockCreateAuthor).not.toHaveBeenCalled()
    })
  })

  describe('closing', () => {
    it('calls setIsOpen(false) when the close button is clicked', () => {
      const { setIsOpen } = renderSlideout()

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))

      expect(setIsOpen).toHaveBeenCalledTimes(1)
      expect(setIsOpen).toHaveBeenCalledWith(false)
      expect(mockCreateAuthor).not.toHaveBeenCalled()
    })

    it('calls setIsOpen(false) when the backdrop is clicked', () => {
      const { container, setIsOpen } = renderSlideout()

      fireEvent.click(container.firstChild as HTMLElement)

      expect(setIsOpen).toHaveBeenCalledWith(false)
    })

    it('marks the panel inert when closed', () => {
      renderSlideout({ isOpen: false })

      expect(screen.getByRole('complementary', { hidden: true })).toHaveAttribute('inert')
    })
  })
})