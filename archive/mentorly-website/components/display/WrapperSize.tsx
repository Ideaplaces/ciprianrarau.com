import classNames from 'classnames'
import { useWindowSize } from 'lib/useWindowSize'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'

type Props = {
  children: (width: number | undefined) => ReactNode
  className: string
}

const WrapperSize: FC<Props> = ({ children, className }) => {
  const [width, setWidth] = useState<number>()
  const { width: windowSize } = useWindowSize()
  const ref = useRef<HTMLDivElement>(null)

  // @ALERT: won't work properly unless ALL children are loaded
  useEffect(() => {
    ref.current && setWidth(ref.current.offsetWidth)
  }, [windowSize])

  return (
    <div className={classNames('w-full', className)} ref={ref}>
      {children(width)}
    </div>
  )
}

export default WrapperSize
