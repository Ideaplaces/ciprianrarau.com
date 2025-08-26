import classNames from 'classnames'
import { Tab as HeadlessTab } from 'components/Generic/Tabs'
import { FC, ReactNode } from 'react'
export { TabPanel, Tabs } from 'components/Generic/Tabs'

// @TODO: why use this component when we already have another Tabs?

type TabProps = {
  id: string
  children: ReactNode
}

export const Tab: FC<TabProps> = ({ id, children }) => {
  return (
    <HeadlessTab id={id}>
      {({ active, ...props }: { active: boolean; [x: string]: any }) => (
        <a
          className={classNames(
            'inline-block px-6 pt-2 pb-4 font-black border-b-2 border-darkGray -mb-px focus:outline-none hover:border-black',
            {
              'border-black': active,
            }
          )}
          {...props}
        >
          {children}
        </a>
      )}
    </HeadlessTab>
  )
}

type TabListProps = {
  children: ReactNode
}

export const TabList: FC<TabListProps> = ({ children }) => {
  return <ul className="mb-4 border-b border-darkGray flex">{children}</ul>
}
