import classNames from 'classnames'
import Button from 'components/Button/Button'
import Spinner from 'components/feedback/Spinner'
import { forwardRef, ReactText } from 'react'
import { Icon } from 'react-feather'

export type IconButtonProps = {
  className?: string
  icon: Icon
  loading?: boolean
  onClick?: () => void
  size?: ReactText
}
// eslint-disable-next-line react/display-name
const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  ({ className, icon, loading, onClick, size, ...props }, ref) => {
    const Icon = icon
    return (
      <Button
        ref={ref}
        className={classNames(
          'p-2 rounded hover:bg-lightGray relative',
          className
        )}
        variant="icon"
        onClick={onClick}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white">
            <Spinner className="h-6 w-6 border-darkerGray" />
          </div>
        )}
        <Icon size={size} />
      </Button>
    )
  }
)

export default IconButton
