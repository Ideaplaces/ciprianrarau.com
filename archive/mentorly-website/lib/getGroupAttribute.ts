import { Maybe } from 'types/graphql'

export const groupAttributeById = <T extends Record<string, any>>(
  group: T,
  attr: keyof T,
  id?: Maybe<string>
) => {
  return group[attr].find((t: any) => t.key === id)?.name
}
