import { Factory } from 'fishery'
import { Conversation } from 'types/graphql'

export const conversationFactory = Factory.define<Conversation>(
  ({ sequence }) => ({
    events: [],
    groupConversation: true,
    id: sequence.toString(),
    internalId: sequence.toString(),
    isAnnouncement: false,
    isFiltering: false,
    lastEventAt: undefined,
    lastVisitedAt: undefined,
    memberCount: 0,
    memberFilters: undefined,
    members: [],
    memberships: [],
    messages: [],
    name: undefined,
    otherMembers: [],
    otherMembersCount: 0,
    otherRecipients: [],
    recipientIds: [],
    recipients: [],
    sender: undefined,
  })
)
