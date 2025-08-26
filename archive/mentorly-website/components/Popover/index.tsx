import { FC, ReactNode } from 'react'
import { Arrow, ToggleLayer } from 'react-laag'
import ResizeObserver from 'resize-observer-polyfill'

type PopoverProps = {
  className?: string
  children?: ReactNode
  layer: any
}

const Popover: FC<PopoverProps> = ({ className, children, layer }) => {
  return (
    <ToggleLayer
      renderLayer={({ isOpen, layerProps, arrowStyle, layerSide }) =>
        isOpen && (
          <div
            ref={layerProps.ref}
            className="rounder border shadow bg-white border-darkGray"
            style={layerProps.style}
          >
            {layer}
            <Arrow
              style={arrowStyle}
              layerSide={layerSide}
              backgroundColor="white"
              borderWidth={1}
              borderColor="#cccccc"
              roundness={0.5}
            />
          </div>
        )
      }
      closeOnOutsideClick={true}
      placement={{
        autoAdjust: true,
        triggerOffset: 10,
      }}
      ResizeObserver={ResizeObserver}
    >
      {({ triggerRef, toggle }) => (
        <button ref={triggerRef} className={className} onClick={toggle}>
          {children}
        </button>
      )}
    </ToggleLayer>
  )
}

export default Popover
