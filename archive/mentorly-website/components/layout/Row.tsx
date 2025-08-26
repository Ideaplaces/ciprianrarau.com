import classNames from 'classnames'
import { FC, ReactNode, ReactText } from 'react'

export type RowProps = {
  children: ReactNode
  cols: ReactText
  gap?: 3 | 6
  className?: string
}
export const Row: FC<RowProps> = ({ children, cols, gap, className }) => {
  const columns = cols ? `lg:grid-cols-${cols}` : 'lg:grid-cols-3'
  const gapWidth = gap ? `gap-${gap}` : 'gap-6'

  return (
    <div className={classNames('w-full grid', columns, gapWidth, className)}>
      {children}
    </div>
  )
}

export default Row
