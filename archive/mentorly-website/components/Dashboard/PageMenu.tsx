import classNames from 'classnames'
import {
  TabListProps,
  TabRowResponsive,
  TabRowResponsiveProps,
} from 'components/Generic/Tabs'
import { FC, ReactNode } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

type PageMenuProps = TabRowResponsiveProps & {
  loading?: boolean
  headerId?: string
  CTAbutton?: ReactNode | JSX.Element
  className?: string
  switchTab: (option: TabListProps) => void
  tabs: TabListProps[]
}

// @TODO: CTAbutton could be props within PageMenu component
const PageMenu: FC<PageMenuProps> = ({
  loading,
  headerId,
  CTAbutton,
  tabs,
  activeTab,
  switchTab,
  className,
}) => {
  const { formatMessage }: IntlShape = useIntl()

  return (
    <div className={classNames('flex flex-col w-full pb-5', className)}>
      {headerId && (
        <h2 className="font-black text-2xl pt-2 pb-6">
          {loading ? (
            <Skeleton
              className="h-6"
              width={formatMessage({ id: headerId }).length * 25}
            />
          ) : (
            formatMessage({ id: headerId })
          )}
        </h2>
      )}
      <div className="flex items-center justify-between flex-nowrap w-full pt-2 pb-5 h-12 space-x-2">
        <TabRowResponsive
          loading={loading}
          activeTab={activeTab}
          switchTab={switchTab}
          tabs={tabs}
        />
        {CTAbutton && <div className="ml-auto">{CTAbutton}</div>}
      </div>
    </div>
  )
}

export default PageMenu
