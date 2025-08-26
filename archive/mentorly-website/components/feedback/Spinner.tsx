import classNames from 'classnames'
import useMounted from 'lib/hooks/useMounted'
import { VFC } from 'react'

export type SpinnerProps = {
  color?: string
  className?: string
}

export const FullSpinner: VFC<SpinnerProps> = ({ className, ...props }) => {
  return (
    <div
      className={classNames(
        `container mx-auto mt-16 w-full h-full flex items-center justify-center`,
        className
      )}
    >
      <Spinner {...props} />
    </div>
  )
}

const Spinner: VFC<SpinnerProps> = ({ color, className }) => {
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="25 25 50 50"
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
      className={className}
    >
      <path
        fill={color}
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

Spinner.defaultProps = {
  color: '#111111',
  className: 'w-8',
}

export default Spinner
