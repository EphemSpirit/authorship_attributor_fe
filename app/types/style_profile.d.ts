import StyleFeature from "./style_feature"

type StyleProfile = {
  author_id: number,
  computed_at: date,
  features: StyleFeature[],
  id: number,
  model_version: string,
  num_documents_used: number
}