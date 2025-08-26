import classNames from 'classnames'
import capitalize from 'lodash/capitalize'
import { VFC } from 'react'

export type SegmentMenuProps = {
  currentSegment: 'mentor' | 'mentee'
  onClickSegment: (...args: any) => void
  className?: string
}

const SegmentMenu: VFC<SegmentMenuProps> = ({
  currentSegment,
  onClickSegment,
  className,
}) => {
  const segments = ['mentee', 'mentor']

  return (
    <div className={classNames(className)}>
      {segments.map((segment) => {
        const active = currentSegment === segment
        return (
          <button
            key={segment}
            className={`py-1 px-2 focus:outline-none border-none text-sm ${
              active && 'font-black'
            }`}
            value={segment}
            onClick={onClickSegment}
          >
            {capitalize(segment)}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentMenu
