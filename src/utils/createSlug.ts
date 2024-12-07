import slugify from 'slugify'

const createSlug = (str: string) =>
  slugify(str, {
    lower: true,
    strict: true,
  })

export default createSlug
