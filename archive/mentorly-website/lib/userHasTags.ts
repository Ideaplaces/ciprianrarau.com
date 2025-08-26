export type User = {
  tags: [
    {
      name: string
      [x: string]: any
    }
  ]
  [x: string]: any
}

const userHasTags = (user: User, tags: string[]) => {
  return user?.tags?.some((t) => tags.includes(t.name))
}

export default userHasTags
