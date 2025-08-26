import classNames from 'classnames'
import { compact, isEmpty } from 'lodash'
import { FC, ReactNode } from 'react'

const isObj = (c: unknown): c is CrumbType => c instanceof Object

export type BreadcrumbsProps = {
  label?: ReactNode
  crumbs: (CrumbType | string)[]
  divider?: ReactNode
  spacing?: string
  nextCrumbsClass?: string
  pastCrumbsClass?: string
  currentIndex?: number
  className?: string
}
const Breadcrumbs: FC<BreadcrumbsProps> = ({
  label,
  divider,
  spacing = 'mr-2',
  crumbs,
  nextCrumbsClass = 'hidden',
  pastCrumbsClass,
  currentIndex,
  className,
  ...props
}) => {
  const crumbSet = crumbs.map((c, i) => {
    const crumb = isObj(c) ? { ...c } : { label: c }

    const isActive = (
      isObj(c) ? c.isActive : currentIndex && currentIndex >= i
    ) as boolean

    if (
      (!isObj(c) && !!c) ||
      (isObj(c) && !(isEmpty(c.label) && isEmpty(c.placeholder)))
    ) {
      return (
        <span key={i} className="flex whitespace-nowrap">
          {i > 0 && (
            <span
              className={classNames(
                spacing,
                isActive ? pastCrumbsClass : nextCrumbsClass
              )}
            >
              {divider || '›'}
            </span>
          )}
          <Crumb
            key={i}
            {...props}
            {...crumb}
            nextCrumbsClass={nextCrumbsClass}
            pastCrumbsClass={pastCrumbsClass}
            isActive={isActive}
            spacing={spacing}
          />
        </span>
      )
    }
  })

  if (isEmpty(compact(crumbSet))) return null

  return (
    <div className={classNames('flex items-start justify-start', className)}>
      <div className={classNames('whitespace-nowrap', spacing)}>{label}</div>
      <div className="flex flex-wrap">{compact(crumbSet)}</div>
    </div>
  )
}

type CrumbType = {
  label?: ReactNode
  placeholder?: ReactNode
  onClick?: () => void
  nextCrumbsClass?: string
  pastCrumbsClass?: string
  currentIndex?: number
  isActive?: boolean
  spacing?: string
}
const Crumb: FC<CrumbType> = ({
  label,
  placeholder,
  onClick,
  nextCrumbsClass,
  pastCrumbsClass,
  isActive,
  spacing,
}) => {
  const labelToRender = () => {
    if (isActive) {
      return label
    } else if (placeholder) {
      return placeholder
    } else if (nextCrumbsClass) {
      return label
    }
  }
  return (
    <div
      onClick={isActive ? onClick : undefined}
      className={classNames(
        spacing,
        isActive ? pastCrumbsClass : nextCrumbsClass,
        isActive &&
          onClick &&
          'text-highlightColor text-underline cursor-pointer'
      )}
    >
      {labelToRender()}
    </div>
  )
}

export default Breadcrumbs
