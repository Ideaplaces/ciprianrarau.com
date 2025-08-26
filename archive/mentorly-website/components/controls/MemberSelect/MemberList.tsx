import classNames from 'classnames'
import Avatar from 'components/display/Avatar'
import Spinner from 'components/feedback/Spinner'
import { formatScore } from 'lib/matching'
import {
  Dispatch,
  FC,
  LegacyRef,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { Send } from 'react-feather'
import { useIntl } from 'react-intl'
import { User } from 'types/graphql'

type MemberListProps = {
  members: User[]
  enableEmail: boolean
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  loading: boolean
  handleChange: (props?: any) => void
  omitIds: string[]
}

const MemberList: FC<MemberListProps> = (props) => {
  const {
    members,
    enableEmail,
    query,
    setQuery,
    loading,
    handleChange,
    omitIds,
  } = props

  const { formatMessage } = useIntl()
  const memberList = useRef<HTMLDivElement>(null)

  const memberOptions = omitIds
    ? members?.filter((m) => !omitIds.includes(m.id))
    : members

  // @TODO: use clickedOutside function from lib
  function didClickOutside(this: MouseEvent) {
    const clickedInside = memberList?.current?.contains(this.currentTarget)
    if (!clickedInside) {
      setQuery('')
    }
  }
  useEffect(() => {
    document.addEventListener('click', didClickOutside)
    return () => {
      document.removeEventListener('mousedown', didClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <DropdownContainer {...props}>
        <div className="h-full flex justify-center">
          <Spinner color="darkGray" />
        </div>
      </DropdownContainer>
    )
  }

  return (
    <DropdownContainer {...props} memberList={memberList}>
      {enableEmail && (
        <div className="py-2 hover:bg-gray border-b border-gray flex items-center cursor-pointer">
          <div
            className="text-sm opacity-75 flex items-center"
            onClick={() => handleChange({ data: query, type: 'email' })}
          >
            <Send className="ml-2 mr-3" />
            {formatMessage({ id: 'term.inviteEmail' })}:&nbsp;
            <span className="ml-1 font-bold">{query}</span>
          </div>
        </div>
      )}

      <MemberResults members={memberOptions} handleChange={handleChange} />
    </DropdownContainer>
  )
}

type MemberResultsProps = {
  members: User[]
  handleChange: (props?: any) => void
}
const MemberResults: FC<MemberResultsProps> = ({ members, handleChange }) => {
  const { formatMessage } = useIntl()

  if (!members || members.length === 0) {
    return (
      <div className="pl-2 text-center flex flex-col h-full justify-center text-darkGray">
        <p>{formatMessage({ id: 'faq.noResults' })}</p>
      </div>
    )
  }

  return (
    <>
      {members.map((member) => (
        <MemberResult
          member={member}
          handleChange={handleChange}
          key={member.id}
        />
      ))}
    </>
  )
}

type MemberResultProps = {
  member: User & { score?: any }
  handleChange: (props?: any) => void
}

const MemberResult: FC<MemberResultProps> = ({ member, handleChange }) => {
  const secondaryText = (member: User) => {
    const discipline = member.discipline && member.discipline.name
    const company = member.company
    const location = member.location
    return [discipline, company, location].filter(Boolean).join(' · ')
  }
  return (
    <div
      data-testid={`memberResult${member.id}`}
      className="py-2 px-2 hover:bg-gray border-b border-gray flex items-center justify-between cursor-pointer"
      onClick={() => {
        handleChange && handleChange({ data: member, type: 'member' })
      }}
      key={member.id}
    >
      <div className="flex items-center">
        <Avatar
          mentor={member.mentor}
          color={member.avatar?.color}
          initials={member.avatar?.initials}
          size="s"
          imageUrl={member.avatar?.imageUrl}
          className="mr-4"
        />
        <div>
          <div className="text-sm font-bold">{member.name}</div>
          <div className="text-sm opacity-75">{secondaryText(member)}</div>
        </div>
      </div>
      <div>{formatScore(member.score)}</div>
    </div>
  )
}

type DropdownContainerProps = {
  children?: ReactNode
  className?: string
  otherClassNames?: string
  loading?: boolean
  memberList?: LegacyRef<HTMLDivElement>
  inline?: boolean
  showDefaultUsers?: boolean
  height?: string | number
}

const DropdownContainer: FC<DropdownContainerProps> = ({
  children,
  className,
  otherClassNames,
  height,
  memberList,
  loading,
  inline,
  showDefaultUsers,
}) => {
  const listHeight = `h-${height || '64'}`

  return (
    <div
      data-testid="memberListDropdownContainer"
      ref={memberList}
      className={classNames(
        'bg-white z-20 left-0 right-0 border-t-0 flex flex-col overflow-y-auto',
        { 'shadow-xl': !showDefaultUsers && !inline },
        inline ? 'relative' : 'absolute',
        listHeight,
        className,
        otherClassNames
      )}
    >
      {loading ? (
        <div className="flex w-full items-center">
          <Spinner className="h-8 opacity-50 mx-auto mt-4" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export { MemberResult }
export default MemberList
