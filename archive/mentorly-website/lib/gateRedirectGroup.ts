import env from 'lib/env'
import { flatten } from 'lodash'
import { Maybe } from 'types/graphql'

type GroupType = {
  id: string
  slug: string
}

export type gateRedirectGroupProps = {
  user?: Maybe<{
    group?: Maybe<GroupType>
    accounts?: Maybe<{
      groups?: Maybe<GroupType[]>
    }>[]
  }>
  currentGroup: GroupType
}
export const gateRedirectGroup = (
  user: gateRedirectGroupProps['user'],
  currentGroup: gateRedirectGroupProps['currentGroup']
) => {
  if (!currentGroup) return user?.group

  if (env.development || env.staging) return currentGroup

  return (
    flatten(user?.accounts?.map((acc) => acc?.groups)).find(
      (group) => group?.id === currentGroup.id
    ) || user?.group
  )
}
