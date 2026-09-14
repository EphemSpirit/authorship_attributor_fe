import StyleProfile from "./style_profile"

type StyleFeature = {
  id: number,
  profile_id: number,
  feature_type: string,
  profile_vector: number[],
  feature_names: string[],
  profile: StyleProfile
}