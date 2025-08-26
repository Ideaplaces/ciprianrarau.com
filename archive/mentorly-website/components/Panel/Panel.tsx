import classNames from 'classnames'
import ErrorBoundary from 'components/ErrorBoundary'
import { FC, ReactNode } from 'react'

import { Wave } from '../Wave/Wave'

type ContainerProps = {
  children: ReactNode
  flex?: boolean
  className?: string
}

const Container: FC<ContainerProps> = ({ children, flex, className }) => (
  <div
    className={classNames(
      'container mx-auto',
      flex && 'md:flex justify-between',
      className
    )}
  >
    {children}
  </div>
)

type PanelProps = {
  color?: string
  className?: string
  children: ReactNode
  hasWave?: boolean
  style?: Record<string, any>
}
const Panel = ({
  color = 'white',
  className,
  children,
  hasWave,
  style,
}: PanelProps): JSX.Element => {
  const textColor = ['blue', 'purple'].includes(color) ? 'white' : 'black'

  return (
    <ErrorBoundary>
      <section
        className={classNames(
          'relative flex flex-col lg:justify-center wrapper pt-6 pb-32',
          color && `bg-${color}`,
          `text-${textColor}`,
          className
        )}
        style={style}
      >
        {hasWave && (
          <div className="absolute top-0 left-0 right-0 h-24 -mt-24">
            <Wave color={`text-${color}`} />
          </div>
        )}
        {children}
      </section>
    </ErrorBoundary>
  )
}

Panel.Container = Container
export default Panel
