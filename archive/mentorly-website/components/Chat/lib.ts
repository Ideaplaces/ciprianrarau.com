import { differenceInMinutes, parseISO } from 'date-fns'
import { ConversationEvent, Maybe } from 'types/graphql'

type shouldCollapsePropType = {
  user: { id: string }
  createdAt: ConversationEvent['createdAt']
}

export const shouldCollapse = (
  previous: Maybe<shouldCollapsePropType>,
  event: shouldCollapsePropType
) => {
  if (!previous) {
    return false
  }

  if (previous.user.id !== event.user.id) {
    return false
  }

  const previousTime = parseISO(previous.createdAt)
  const currentTime = parseISO(event.createdAt)
  const delta = differenceInMinutes(currentTime, previousTime)

  return delta < 5
}
