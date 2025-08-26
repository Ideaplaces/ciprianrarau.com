import classNames from 'classnames'
import { FC, forwardRef, ReactNode, Ref } from 'react'
import { MoreVertical as MoreIcon } from 'react-feather'
import { Arrow, ToggleLayer } from 'react-laag'
import ResizeObserver from 'resize-observer-polyfill'

type DropdownTriggerProps = {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DropdownTrigger = forwardRef(
  (
    { className, onClick }: DropdownTriggerProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button className={className} ref={ref} onClick={onClick}>
        <MoreIcon />
      </button>
    )
  }
)

DropdownTrigger.displayName = 'DropdownTrigger'

export type DropdownProps = {
  children: (props: any) => void
  className?: string
  trigger?: ReactNode
  noArrow?: boolean
  borderRounded?: boolean
}

const Dropdown: FC<DropdownProps> & DropdownTriggerProps = ({
  className,
  children,
  trigger,
  noArrow,
  borderRounded,
}) => {
  const isNull = children === null || children === undefined

  return !isNull ? (
    <ToggleLayer
      renderLayer={({ isOpen, layerProps, arrowStyle, layerSide, close }) =>
        isOpen && (
          <div
            ref={layerProps.ref}
            className={classNames(
              'bg-white text-black shadow py-1 border border-darkGray z-10',
              {
                rounded: borderRounded,
              }
            )}
            style={layerProps.style}
          >
            {children(close)}
            {!noArrow && (
              <Arrow
                style={arrowStyle}
                layerSide={layerSide}
                borderWidth={1}
                borderColor={'#cccccc'}
                roundness={0.5}
              />
            )}
          </div>
        )
      }
      closeOnOutsideClick
      placement={{
        anchor: 'BOTTOM_RIGHT',
        possibleAnchors: ['BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'],
        autoAdjust: true,
        triggerOffset: 10,
      }}
      ResizeObserver={ResizeObserver}
    >
      {({ triggerRef, toggle }) => (
        <div className={className} ref={triggerRef} onClick={toggle}>
          {trigger || <DropdownTrigger />}
        </div>
      )}
    </ToggleLayer>
  ) : null
}

export default Dropdown
