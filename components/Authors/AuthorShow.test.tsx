import { render, screen } from '@testing-library/react'
import AuthorShow from './AuthorShow'
import Author from '@/app/types/author'

const author: Author = {
  id: 1,
  author_metadata: {
    age: 42,
    bio: 'Writes things.',
  },
  name: 'Ursula K. Le Guin',
  style_profiles: [],
}

describe('AuthorShow', () => {
  it("renders the author's name", () => {
    render(<AuthorShow author={author} />)

    expect(screen.getByText(author.name, { exact: false })).toBeInTheDocument()
  })
})