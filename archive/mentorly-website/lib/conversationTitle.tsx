import { groupAttributeById } from 'lib/getGroupAttribute'
import { useCurrentGroup } from 'lib/GroupContext'
import { compact } from 'lodash'
import { useIntl } from 'react-intl'
import {
  ConversationInfoFieldsFragment,
  GroupEssentialsFieldsFragment,
  Maybe,
} from 'types/graphql'

const useConversationTitle = (
  conversation?: Maybe<ConversationInfoFieldsFragment>
) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  return conversationTitle(conversation, formatMessage, currentGroup)
}

const conversationTitle = (
  conversation: Maybe<ConversationInfoFieldsFragment> | undefined,
  formatMessage: ({ id }: { id: string }) => string,
  group: GroupEssentialsFieldsFragment
) => {
  if (!conversation) return ''

  const { name, otherMembers, otherMembersCount, isAnnouncement } = conversation

  if (name) return name

  if (isAnnouncement) {
    const { segment, cohort, disciplineId, query, tag, experience } =
      conversation.memberFilters || {}

    const getTerm = (term: string) => formatMessage({ id: `term.${term}` })

    const all = getTerm('all')
    const from = getTerm('from')
    const and = getTerm('with')
    const years = getTerm('experience')
    const including = getTerm('and')
    const containing = getTerm('containing')

    const title = [all, segment]

    if (cohort || disciplineId) {
      const titleContinued = compact([
        from,
        cohort,
        groupAttributeById<GroupEssentialsFieldsFragment>(
          group,
          'disciplines',
          disciplineId
        ),
      ]).join(' ')

      title.push(titleContinued)
    }

    tag &&
      title.push(
        and +
          ' ' +
          groupAttributeById<GroupEssentialsFieldsFragment>(group, 'tags', tag)
      )
    query && title.push(containing + ` "${query}"`)
    experience && title.push(including + ` ${experience} ${years}`)

    return compact(title).join(' ').trim()
  }

  if (!otherMembers || otherMembers.length < 1) {
    return formatMessage({ id: 'session.awaitingGuests' })
  }

  if (otherMembers.length > 1) {
    const others = formatMessage({ id: 'term.others' })
    return `${otherMembers[0].name} + ${otherMembersCount - 1} ${others}`
  }

  return otherMembers[0].name
}

export { conversationTitle, useConversationTitle }
