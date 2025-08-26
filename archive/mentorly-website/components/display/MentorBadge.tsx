import classNames from 'classnames'
import SmallLogo from 'components/general/SmallLogo'
import { useCurrentGroup } from 'lib/GroupContext'
import { VFC } from 'react'

export type MentorBadgeProps = {
  className?: string
}

const MentorBadge: VFC<MentorBadgeProps> = ({ className }) => {
  const { currentGroup } = useCurrentGroup()

  return (
    <div
      className={classNames(
        'w-6 h-6 bg-yellow text-black rounded-full flex items-center justify-center',
        className
      )}
    >
      <SmallLogo
        className="relative w-1/2 h-1/2"
        color="black"
        whiteLabel={currentGroup?.whiteLabel}
      />
    </div>
  )
}

export default MentorBadge
