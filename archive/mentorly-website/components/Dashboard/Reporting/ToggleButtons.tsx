import classNames from 'classnames'
import { VFC } from 'react'

export type ToggleButtonsProps = {
  view: string
  onClick: (...args: any) => void
  views: Array<{ id: string; label: string }>
  className?: string
}

const ToggleButtons: VFC<ToggleButtonsProps> = ({
  view: toggleView,
  onClick,
  views,
  className,
}) => {
  return (
    <div className={classNames(className, 'inline')}>
      {views.map((view, i) => {
        const active = toggleView === view.id
        return (
          <button
            key={`view-${i}`}
            className={`py-2 px-3 focus:outline-none border-none text-sm ${
              active && 'font-black bg-gray rounded'
            }`}
            value={view.id}
            onClick={(e) => onClick(e)}
          >
            {view.label}
          </button>
        )
      })}
    </div>
  )
}

export default ToggleButtons
