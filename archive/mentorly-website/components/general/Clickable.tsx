import {
  createElement,
  FC,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'

export type ClickableProps = {
  onClick?: (event: React.MouseEvent<any>) => void
  as?: ReactElement
  href?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  ref?: Ref<any>
  children: ReactNode
}

const Clickable: FC<ClickableProps> = forwardRef(
  ({ as, ...props }, ref: Ref<any>) => {
    const Component = createElement(as || props.href ? 'a' : 'button', {
      ref,
      ...props,
    })

    return Component
  }
)

Clickable.displayName = 'Clickable'

export default Clickable
