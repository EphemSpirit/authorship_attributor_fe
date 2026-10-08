import StyleProfile from "./style_profile"

type Author = {
  id: number,
  author_metadata: {
    age: number,
    bio: string
  }
  name: string,
  style_profiles: StyleProfile[]
}

export default Author