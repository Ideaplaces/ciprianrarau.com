import { RefetchQueriesFunction } from '@apollo/client'
import Field from 'components/controls/Field'
import MemberSelect from 'components/controls/MemberSelect'
import DivButtonSelect from 'components/display/DivButtonSelect'
import Spinner from 'components/feedback/Spinner'
import { FormikValues, useFormikContext } from 'formik'
import { useCurrentGroup } from 'lib/GroupContext'
import {
  ArrayParam,
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'lib/next-query-params'
import { capitalize, compact, isEmpty, omitBy, uniq } from 'lodash'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { MessageSquare, Rss } from 'react-feather'
import { useIntl } from 'react-intl'
import { useGroupSearchMembersQuery, User } from 'types/graphql'

import Composer from './Composer'

type NewMessageProps = {
  close: () => void
  refetchConversations: RefetchQueriesFunction
}

const NewMessage: FC<NewMessageProps> = ({ close, refetchConversations }) => {
  const [query] = useQueryParams({
    groupId: NumberParam,
    userIds: ArrayParam,
    id: NumberParam,
    locale: StringParam,
    page: NumberParam,
    search: StringParam,
    segment: StringParam,
    disciplineId: StringParam,
    cohort: StringParam,
    tag: StringParam,
    status: StringParam,
    archived: BooleanParam,
  })

  const nonFilterParams = ['groupId', 'userIds', 'id', 'locale', 'page']
  const filters = omitBy(
    query,
    (v, k) => nonFilterParams.includes(k) || v === undefined
  )
  const filtering = !isEmpty(filters)

  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [messageType, setMessageType] = useState<string>(
    filtering ? 'announcement' : 'conversation'
  )
  const { values, setFieldValue } = useFormikContext<FormikValues>()

  const [userIds, setUserIds] = useState(query?.userIds || [])
  const recipients = values?.recipients || []
  const recipientIds = recipients.map((u: User) => u.id)
  const allUserIds = uniq(compact([...userIds, ...recipientIds]))

  const { error, data, loading } = useGroupSearchMembersQuery({
    variables: {
      groupId: currentGroup.id,
      userIds: userIds as string[],
    },
    skip: !(userIds?.length > 0),
  })

  useEffect(() => {
    setFieldValue('recipients', data?.group?.members || [])
  }, [data])

  const messageOptions = [
    {
      id: 'conversation',
      content: (
        <div className="flex space-x-2 whitespace-nowrap items-center">
          <MessageSquare size={18} />
          <p>{formatMessage({ id: 'term.newMessage' })}</p>
        </div>
      ),
      disabled: filtering && 'form.messageType.noConvoToFilters',
      tooltip: !filtering ? 'form.messageType.conversation.tooltip' : undefined,
    },
    {
      id: 'announcement',
      content: (
        <div className="flex space-x-2 whitespace-nowrap items-center">
          <Rss size={18} />
          <p>{formatMessage({ id: 'term.newAnnouncement' })}</p>
        </div>
      ),
      tooltip: 'form.messageType.announcement.tooltip',
    },
  ]

  const handleRemove = (user: Pick<User, 'id'>) => {
    setUserIds(userIds.filter((u) => u !== user.id))
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <div className="flex flex-col flex-grow flex-1 h-full p-2">
      <div className="p-2 font-bold flex flex-0 flex-wrap w-full space-x-2">
        <DivButtonSelect
          selected={messageType}
          setSelected={setMessageType}
          options={messageOptions}
          className="text-sm"
          buttonPadding={2}
          hideTitle
        />
      </div>
      <div className="px-2 py-0 mb-0 flex items-start flex-0">
        <div className="mr-2 mt-1 mb-2">
          {capitalize(formatMessage({ id: 'term.to' }))}:
        </div>
        {loading ? (
          <Spinner className="w-5 ml-1" />
        ) : (
          <div className="flex flex-col space-y-0">
            <Field // @TODO: allow for search by Tag/Cohort/Discipline?
              name="recipients"
              control={MemberSelect}
              placeholder={
                !filtering
                  ? formatMessage({
                      id: `placeholder.enterUserName`,
                    })
                  : undefined
              }
              userIds={userIds}
              memberCount={data?.group?.memberCount}
              readOnly={filtering}
              filters={filters}
              className="mb-0"
              onRemove={filtering ? undefined : handleRemove}
              borderless
              listInside
              isMulti
              hideLabel
            />
            <Link href={`/${locale}/dashboard/members/`}>
              <a className="text-xs text-purple pb-1 mr-auto">
                {formatMessage({ id: 'messaging.searchByFilters' })}
              </a>
            </Link>
          </div>
        )}
      </div>

      <Composer
        userIds={allUserIds}
        filters={filters}
        close={close}
        messageType={messageType}
        refetchConversations={refetchConversations}
      />
    </div>
  )
}

export default NewMessage
