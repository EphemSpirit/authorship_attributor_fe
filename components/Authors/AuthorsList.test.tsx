import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import AuthorsList from './AuthorsList'
import Author from '@/app/types/author'
import { deleteAuthor } from '@/utils/author_actions'

// Server actions are mocked so nothing hits the network.
jest.mock('@/utils/author_actions', () => ({
  deleteAuthor: jest.fn(),
}))

// The slideout and delete modal have their own test files. Here we only care
// that AuthorsList opens them with the right author and wires up their
// callbacks, so we swap in lightweight stubs that expose the props they get.
jest.mock('./AuthorSlideout', () => ({
  __esModule: true,
  default: ({ author, setIsOpen }: { author?: Author; setIsOpen: (open: boolean) => void }) => (
    <div data-testid="author-slideout">
      {author ? `Editing ${author.name}` : 'Creating new author'}
      <button type="button" onClick={() => setIsOpen(false)}>
        Close slideout
      </button>
    </div>
  ),
}))

jest.mock('./DeleteAuthorModal', () => ({
  __esModule: true,
  default: ({
    author,
    onCancel,
    onConfirm,
  }: {
    author: Author
    onCancel: () => void
    onConfirm: (id: number) => void
  }) => (
    <div data-testid="delete-author-modal">
      Deleting {author.name}
      <button type="button" onClick={onCancel}>
        Cancel delete
      </button>
      <button type="button" onClick={() => onConfirm(author.id)}>
        Confirm delete
      </button>
    </div>
  ),
}))

const mockDeleteAuthor = deleteAuthor as jest.MockedFunction<typeof deleteAuthor>

const styleProfile = {
  id: 1,
  author_id: 1,
  computed_at: new Date('2026-01-01'),
  features: [],
  model_version: 'v1',
  num_documents_used: 3,
} as unknown as Author['style_profiles'][number]

const longBio =
  'An American author best known for her works of speculative fiction, including science fiction and fantasy.'

const authors: Author[] = [
  {
    id: 1,
    name: 'Ursula K. Le Guin',
    author_metadata: { age: 88, bio: longBio },
    style_profiles: [styleProfile],
  },
  {
    id: 2,
    name: 'Octavia Butler',
    author_metadata: { age: 58, bio: 'Speculative fiction.' },
    style_profiles: [],
  },
]

const renderList = (list: Author[] = authors) => render(<AuthorsList authors={list} />)

const getRow = (name: string) => screen.getByRole('cell', { name }).closest('tr') as HTMLElement

const clickInRow = (authorName: string, buttonName: string) =>
  fireEvent.click(within(getRow(authorName)).getByRole('button', { name: buttonName }))

describe('AuthorsList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('table', () => {
    it('renders the column headers', () => {
      renderList()

      const headers = screen.getAllByRole('columnheader').map((th) => th.textContent)
      expect(headers).toEqual(['Name', 'Age', 'Bio', 'Style Profile', 'Edit', 'Delete'])
    })

    it('renders one row per author', () => {
      renderList()

      // +1 for the header row
      expect(screen.getAllByRole('row')).toHaveLength(authors.length + 1)
    })

    it('renders only the header row when there are no authors', () => {
      renderList([])

      expect(screen.getAllByRole('row')).toHaveLength(1)
    })

    it("renders each author's name and age", () => {
      renderList()

      authors.forEach((author) => {
        const row = within(getRow(author.name))
        expect(row.getByRole('cell', { name: author.name })).toBeInTheDocument()
        expect(row.getByRole('cell', { name: String(author.author_metadata.age) })).toBeInTheDocument()
      })
    })

    it('renders short bios in full', () => {
      renderList()

      const row = within(getRow('Octavia Butler'))
      expect(row.getByRole('cell', { name: 'Speculative fiction.' })).toBeInTheDocument()
    })

    it('truncates bios longer than 50 characters with an ellipsis', () => {
      renderList()

      const row = within(getRow('Ursula K. Le Guin'))
      expect(row.getByRole('cell', { name: `${longBio.slice(0, 50)}…` })).toBeInTheDocument()
      expect(row.queryByText(longBio)).not.toBeInTheDocument()
    })

    it('links to the profile page when the author has a style profile', () => {
      renderList()

      const row = within(getRow('Ursula K. Le Guin'))
      expect(row.getByRole('link', { name: 'View Profile' })).toHaveAttribute('href', '/authors/1')
      expect(row.queryByText('No Profile Generated Yet')).not.toBeInTheDocument()
    })

    it('shows a placeholder when the author has no style profile', () => {
      renderList()

      const row = within(getRow('Octavia Butler'))
      expect(row.getByText('No Profile Generated Yet')).toBeInTheDocument()
      expect(row.queryByRole('link', { name: 'View Profile' })).not.toBeInTheDocument()
    })

    it('renders edit and delete buttons for every author', () => {
      renderList()

      authors.forEach((author) => {
        const row = within(getRow(author.name))
        expect(row.getByRole('button', { name: 'Edit Author' })).toBeInTheDocument()
        expect(row.getByRole('button', { name: 'Delete Author' })).toBeEnabled()
      })
    })
  })

  describe('author slideout', () => {
    it('is not rendered initially', () => {
      renderList()

      expect(screen.queryByTestId('author-slideout')).not.toBeInTheDocument()
    })

    it('opens in create mode when "New Author" is clicked', () => {
      renderList()

      fireEvent.click(screen.getByRole('button', { name: 'New Author' }))

      expect(screen.getByTestId('author-slideout')).toHaveTextContent('Creating new author')
    })

    it('opens in edit mode for the matching author when "Edit Author" is clicked', () => {
      renderList()

      clickInRow('Octavia Butler', 'Edit Author')

      expect(screen.getByTestId('author-slideout')).toHaveTextContent('Editing Octavia Butler')
    })

    it('opens in create mode after previously editing an author', () => {
      renderList()

      clickInRow('Octavia Butler', 'Edit Author')
      fireEvent.click(screen.getByRole('button', { name: 'Close slideout' }))
      fireEvent.click(screen.getByRole('button', { name: 'New Author' }))

      expect(screen.getByTestId('author-slideout')).toHaveTextContent('Creating new author')
    })

    it('unmounts when the slideout closes itself', () => {
      renderList()

      fireEvent.click(screen.getByRole('button', { name: 'New Author' }))
      fireEvent.click(screen.getByRole('button', { name: 'Close slideout' }))

      expect(screen.queryByTestId('author-slideout')).not.toBeInTheDocument()
    })
  })

  describe('delete modal', () => {
    it('is not rendered initially', () => {
      renderList()

      expect(screen.queryByTestId('delete-author-modal')).not.toBeInTheDocument()
    })

    it('opens for the matching author when "Delete Author" is clicked', () => {
      renderList()

      clickInRow('Octavia Butler', 'Delete Author')

      expect(screen.getByTestId('delete-author-modal')).toHaveTextContent('Deleting Octavia Butler')
      expect(mockDeleteAuthor).not.toHaveBeenCalled()
    })

    it('closes without deleting when the modal cancels', () => {
      renderList()

      clickInRow('Octavia Butler', 'Delete Author')
      fireEvent.click(screen.getByRole('button', { name: 'Cancel delete' }))

      expect(screen.queryByTestId('delete-author-modal')).not.toBeInTheDocument()
      expect(mockDeleteAuthor).not.toHaveBeenCalled()
    })

    it("calls deleteAuthor with the author's id when the modal confirms, then closes", async () => {
      mockDeleteAuthor.mockResolvedValue({ success: true, error: null })
      renderList()

      clickInRow('Octavia Butler', 'Delete Author')
      fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }))

      expect(mockDeleteAuthor).toHaveBeenCalledTimes(1)
      expect(mockDeleteAuthor).toHaveBeenCalledWith(2)
      await waitFor(() => expect(screen.queryByTestId('delete-author-modal')).not.toBeInTheDocument())
    })

    it('disables the delete buttons while a delete is in flight', async () => {
      let resolveDelete!: (value: { success: boolean; error: string | null }) => void
      mockDeleteAuthor.mockImplementation(
        () => new Promise((resolve) => { resolveDelete = resolve })
      )
      renderList()

      clickInRow('Octavia Butler', 'Delete Author')
      fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }))

      await waitFor(() =>
        screen.getAllByRole('button', { name: 'Delete Author' }).forEach((b) => expect(b).toBeDisabled())
      )

      resolveDelete({ success: true, error: null })

      await waitFor(() =>
        screen.getAllByRole('button', { name: 'Delete Author' }).forEach((b) => expect(b).toBeEnabled())
      )
    })
  })
})