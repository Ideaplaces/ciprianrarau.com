import { gql } from '@apollo/client'
import classNames from 'classnames'
import Field from 'components/controls/Field'
import ProgressPill from 'components/Dashboard/ProgressPill'
import Avatar from 'components/display/Avatar'
import Empty from 'components/display/Empty'
import Pill, { PillBox } from 'components/display/Pill'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import TypedMutation from 'components/Graphql/TypedMutation'
import CheckBox from 'components/Input/CheckBox'
import Dropdown from 'components/navigation/Dropdown'
import Menu from 'components/navigation/Menu'
import Pagination from 'components/navigation/Pagination'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { profileUrl } from 'lib/urls'
import { uniq } from 'lodash'
import Link from 'next/link'
import { useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  Maybe,
  useArchiveUserMutation,
  useCreateConversationMutation,
  useDashboardMembersQuery,
  useDeleteUserMutation,
  useUnarchiveUserMutation,
} from 'types/graphql'

import { BulkActionDropdown } from './BulkActionDropdown'

// @TODO: replace `slug group { slug } mentor` with ProfileUrlProps
// @TODO: move to the page that calls this component
gql`
  mutation createConversation($userId: ID!) {
    createConversation(userId: $userId) {
      conversation {
        id
      }
      errors
      errorDetails
    }
  }

  query dashboardMembers(
    $groupId: ID!
    $page: Int = 1
    $query: String
    $segment: String
    $status: String
    $tag: String
    $cohort: String
    $disciplineId: ID
    $archived: Boolean = false
    $locale: String = "en"
    $orderBy: MemberSorting
  ) {
    group: managedGroup(id: $groupId) {
      id
      slug
      memberCount(
        query: $query
        segment: $segment
        status: $status
        cohort: $cohort
        tag: $tag
        disciplineId: $disciplineId
        archived: $archived
      )
      members(
        page: $page
        query: $query
        segment: $segment
        disciplineId: $disciplineId
        status: $status
        cohort: $cohort
        tag: $tag
        archived: $archived
        orderBy: $orderBy
      ) {
        id
        archivedAt
        status
        onboarded
        mentor
        slug
        name
        group {
          slug
        }
        avatar {
          ...AvatarFields
        }
        contactEmail
        disciplines {
          name(locale: $locale)
        }
        subdisciplines {
          name(locale: $locale)
        }
        cohort {
          name
        }
        tags {
          id
          name(locale: $locale)
        }
      }
    }
  }
  ${AvatarFieldsFragmentDoc}
`

type TableProps = {
  page?: Maybe<number>
  setPage: (page: number) => void
  resetFilters: () => void
  search?: Maybe<string>
  segment?: Maybe<string>
  status?: Maybe<string>
  cohort?: Maybe<string>
  tag?: Maybe<string>
  archived?: Maybe<boolean>
  disciplineId?: Maybe<string>
  orderBy?: Maybe<Record<string, string | undefined>>
  values: { selectedMembers: any[] }
  setValues: (...args: any) => void
}

const Table: VFC<TableProps> = ({
  page = 1,
  resetFilters,
  search,
  segment,
  setPage,
  status,
  cohort,
  tag,
  disciplineId,
  values,
  setValues,
  archived,
  orderBy,
}) => {
  const { push } = useRouter()
  const [allSelected, setAllSelected] = useState<boolean>()
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const variables = {
    groupId: currentGroup.id,
    page,
    query: search,
    disciplineId,
    segment,
    status,
    cohort,
    tag,
    archived,
    orderBy,
  }

  useEffect(() => {
    setValues({ ...values, selectedMembers: [] })
  }, [search, segment, disciplineId, cohort, tag, status, archived])

  const { loading, error, data, refetch } = useDashboardMembersQuery({
    variables,
    skip: !currentGroup,
  })

  useEffect(() => {
    //if PM has manually selected all results from a filtered set, consider this a filtered selectAll
    if (values?.selectedMembers?.length === group?.memberCount) {
      setAllSelected(true)
    }
    refetch()
  }, [values])

  if (loading && !data) {
    return (
      <div className="p-4">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        className="m-4"
        title="Error"
        description={error.message}
        type="error"
        showIcon
      />
    )
  }

  const { group } = data || {}

  if (!group || group?.members.length === 0) {
    return <Empty className="h-64" />
  }

  const pageMemberIds = group.members.map((m) => m.id)
  const selectedMemberIds = values?.selectedMembers || []
  const qtySelected = selectedMemberIds.length

  const pageSelected =
    qtySelected > 0 && pageMemberIds.every((m) => selectedMemberIds.includes(m))

  const toggleSelectPageResults = () => {
    if (allSelected) return clearSelection()

    const newSelection = !pageSelected
      ? uniq([...selectedMemberIds, ...pageMemberIds])
      : selectedMemberIds.filter((el) => !pageMemberIds.includes(el))

    setValues({ ...values, selectedMembers: newSelection })
  }

  const selectAllMembers = () => {
    setAllSelected(true)
    setValues({ ...values, selectedMembers: [] })
  }

  const toggleMember = (event: { currentTarget: any }) => {
    const { checked, value } = event.currentTarget
    const isChecked = !checked
    setValues({
      ...values,
      selectedMembers: isChecked
        ? [...selectedMemberIds.filter((el) => el !== value)]
        : [...selectedMemberIds, value],
    })
  }

  const deselectAllMembers = (memberId: string) => {
    setAllSelected(false)
    setValues({
      ...values,
      selectedMembers: pageMemberIds.filter((m) => m !== memberId),
    })
  }

  const clearSelection = () => {
    setAllSelected(false)
    setValues({ ...values, selectedMembers: [] })
  }

  return (
    <div className="overflow-x relative">
      {group.members.length !== 0 && (
        <div
          className={classNames(
            'flex space-x-4 pl-4 mb-4 items-center',
            qtySelected < 1 && 'pt-3'
          )}
        >
          {qtySelected > 0 || allSelected ? (
            <div className="flex items-center space-x-2">
              <BulkActionDropdown
                members={!allSelected ? selectedMemberIds : []}
                filters={allSelected ? variables : {}}
                resetFilters={resetFilters}
                clearSelection={clearSelection}
                refetch={refetch}
                selectCount={
                  allSelected
                    ? group.memberCount
                    : values.selectedMembers.length
                }
                label={formatMessage(
                  { id: 'phrase.selectedOf' },
                  {
                    qty: allSelected ? group.memberCount : qtySelected,
                    type: formatMessage({ id: 'term.members' }).toLowerCase(),
                    total: group.memberCount,
                  }
                )}
              />
              <p className="opacity-60">
                &#8592; {formatMessage({ id: 'tooltip.selectAnOption' })}
              </p>
            </div>
          ) : (
            <div className="text-darkGray">
              &#x2193;&nbsp;&nbsp;
              {formatMessage({
                id: 'form.members.bulkSelect',
              })}
            </div>
          )}
          <Pill className="flex items-center">
            <button onClick={selectAllMembers}>
              {formatMessage(
                { id: 'button.selectAllQtyResults' },
                { qty: group.memberCount }
              )}
            </button>
          </Pill>
          {(selectedMemberIds.length || allSelected) && (
            <Pill className="flex items-center" color="red">
              <button onClick={clearSelection}>{`Clear selection`}</button>
            </Pill>
          )}
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr>
            <th className="font-black text-left pl-4 pr-2 w-8">
              <span className="flex" onClick={toggleSelectPageResults}>
                <CheckBox checked={allSelected || pageSelected} />
              </span>
            </th>
            <th className="w-16">&nbsp;</th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'header.nameEmail' })}
            </th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'term.discipline' })}
            </th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'header.status' })}
            </th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'header.cohortsTags' })}
            </th>
            <th className="">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="pb-10">
          {group.members.map((member) => (
            <tr key={member.id} className="hover:bg-lightGray">
              <td className="pl-4">
                <Field
                  hideLabel
                  type="checkbox"
                  name="selectedMembers"
                  value={member.id}
                  onChange={(data: any) =>
                    allSelected
                      ? deselectAllMembers(member.id)
                      : toggleMember(data)
                  }
                  checked={
                    allSelected
                      ? true
                      : selectedMemberIds.some((m) => m === member.id)
                  }
                  control={CheckBox}
                  className="w-1/2 mb-0"
                />
              </td>
              <td className="py-2">
                <Link href={`/${locale}/dashboard/members/${member.id}`}>
                  <a>
                    <Avatar {...member.avatar} mentor={member.mentor} />
                  </a>
                </Link>
              </td>
              <td>
                <div className="flex items-center">
                  <div className="flex justify-end items-center space-x-2 pr-4">
                    <Link href={`/${locale}/dashboard/members/${member.id}`}>
                      <a className="font-bold mr-2">{member.name}</a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm">
                  <a
                    className="text-blue text-sm"
                    href={`mailto:${member.contactEmail}`}
                  >
                    {member.contactEmail}
                  </a>
                </div>
              </td>
              <td>
                <div className="font-bold">
                  {member.disciplines.map((d) => d.name).join(', ')}
                </div>
                {getFeatureFlag(group, 'userSubdisciplines') && (
                  <div className="text-sm">
                    {member.subdisciplines.map((d) => d.name).join(', ')}
                  </div>
                )}
              </td>
              <td>
                <PillBox>
                  <ProgressPill status={member.status} />
                  {member.onboarded && <ProgressPill status="onboarded" />}
                </PillBox>
              </td>
              <td>
                <PillBox>
                  {member.cohort && <Pill>{member.cohort.name}</Pill>}
                  {member.tags.map((tag) => (
                    <Pill key={tag.id}>{tag.name}</Pill>
                  ))}
                </PillBox>
              </td>
              <td>
                <Dropdown>
                  {() => (
                    <Menu>
                      <Link
                        href={`/${locale}/dashboard/members/${member.id}`}
                        passHref
                      >
                        <Menu.Item>
                          {formatMessage({ id: 'button.edit' })}
                        </Menu.Item>
                      </Link>

                      <a
                        href={profileUrl({ ...member, group }, locale)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Menu.Item className="w-full">
                          {formatMessage({ id: 'menu.viewProfile' })}
                        </Menu.Item>
                      </a>
                      {!member.archivedAt && (
                        <TypedMutation
                          typedMutation={useCreateConversationMutation}
                          onSuccess={({ createConversation }) => {
                            push(
                              `/${locale}/dashboard/messaging/${createConversation.conversation.id}`
                            )
                          }}
                          refetchQueries={['conversations']}
                          variables={{ userId: member.id }}
                        >
                          {({ onClick }) => (
                            <Menu.Item onClick={onClick}>
                              {formatMessage({ id: 'button.sendMessage' })}
                            </Menu.Item>
                          )}
                        </TypedMutation>
                      )}
                      <TypedMutation
                        typedMutation={
                          member.archivedAt
                            ? useUnarchiveUserMutation
                            : useArchiveUserMutation
                        }
                        notification={formatMessage({
                          id: `term.${
                            member.archivedAt ? 'unarchived' : 'archived'
                          }`,
                        })}
                        refetchQueries={['dashboardMembers']}
                        variables={{ id: member.id }}
                      >
                        {({ onClick }) => (
                          <Menu.Item
                            className={
                              member.archivedAt ? 'text-green' : 'text-orange'
                            }
                            onClick={onClick}
                          >
                            {formatMessage({
                              id: `button.${
                                member.archivedAt ? 'unarchive' : 'archive'
                              }`,
                            })}
                          </Menu.Item>
                        )}
                      </TypedMutation>
                      <TypedMutation
                        typedMutation={useDeleteUserMutation}
                        notification="Member deleted!"
                        refetchQueries={['dashboardMembers']}
                        variables={{ id: member.id }}
                      >
                        {({ onClick }) => (
                          <Menu.Item className="text-red" onClick={onClick}>
                            {formatMessage({ id: 'button.delete' })}
                          </Menu.Item>
                        )}
                      </TypedMutation>
                    </Menu>
                  )}
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page || 1}
        per={15}
        setPage={setPage}
        total={group.memberCount}
      />
    </div>
  )
}

export default Table
