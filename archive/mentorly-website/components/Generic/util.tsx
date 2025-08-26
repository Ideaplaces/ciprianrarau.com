import { isEmpty } from 'lodash'
import { cloneElement, isValidElement, ReactNode } from 'react'

export const handleChildren = (
  children: ReactNode,
  props?: Record<string, any>
) => {
  if (!children || isEmpty(children)) {
    return null
  }

  if (isValidElement(children)) {
    return cloneElement(children, props)
  }

  return <>{children}</>
}
