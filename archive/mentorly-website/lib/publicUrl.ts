import { Maybe } from 'types/graphql'

const publicUrl = (path?: Maybe<string>) => {
  if (!path) {
    return path
  }

  if (path.includes('//')) {
    return path
  }

  if (path.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`
}

export default publicUrl
