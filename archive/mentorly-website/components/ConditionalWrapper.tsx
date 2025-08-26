import { FC, ReactElement } from 'react'

import { handleChildren } from './Generic/util'

export type ConditionalWrapperProps = {
  wrapper?: (children: ReactElement | null) => ReactElement<ReactElement>
  condition: boolean
  children: ReactElement | ReactElement[]
}
const ConditionalWrapper: FC<ConditionalWrapperProps> = ({
  wrapper,
  condition,
  children,
}) => {
  if (wrapper && !!condition) {
    return wrapper(handleChildren(children))
  }
  return <>{children}</>
}

export default ConditionalWrapper
