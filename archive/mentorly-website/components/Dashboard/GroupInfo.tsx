import classNames from 'classnames'
import { getGroupFavicon } from 'lib/swapFavicon'
import { ChevronDown } from 'react-feather'

// Define type that includes what GroupInfo needs
type GroupType = {
  id: string
  name: string
  slug?: string
  files?: Array<{ type: string; imageUrl: string }>
  url?: string
}

type GroupInfoProps = {
  collapsed?: boolean
  group: GroupType
  groupAccount?: any
  showChevron?: boolean
}

const GroupAvatar = ({ group }: { group: GroupType }) => {
  const src = getGroupFavicon(group as any) // Using 'as any' as a temporary fix

  if (src) {
    return <img src={src} className="w-6 h-6 mx-auto mt-px" alt={group.name} />
  }

  return (
    <div className="w-6 h-6 bg-yellow text-center rounded">{group.name[0]}</div>
  )
}

const GroupInfo = ({
  collapsed,
  group,
  groupAccount,
  showChevron = true,
}: GroupInfoProps) => {
  if (!group) return null

  return (
    <div
      className={classNames(
        'flex rounded items-center justify-between border-gray border-b px-8 py-4'
      )}
    >
      <div className={classNames('flex-none overflow-hidden h-6')}>
        {collapsed ? (
          <GroupAvatar group={group} />
        ) : (
          <div className="truncate font-bold text-lg overflow-ellipsis w-36">
            {group.name}
          </div>
        )}
      </div>
      {groupAccount && !collapsed && showChevron && (
        <div className="flex-none ml-4">
          <ChevronDown size={16} className="w-4" />
        </div>
      )}
    </div>
  )
}

export default GroupInfo
export { GroupAvatar }
