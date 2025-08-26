import classNames from 'classnames'
import Select, { SelectValue } from 'components/controls/Select'
import { useRouter } from 'lib/router'
import { useWindowSize } from 'lib/useWindowSize'
import { find } from 'lodash'
import React, {
  createContext,
  Dispatch,
  FC,
  MouseEvent,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  VFC,
} from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

type TabsContextData = {
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
}

const tabsContextDefaultValue: TabsContextData = {
  currentTab: '',
  setCurrentTab: () => null,
}

const TabsContext = createContext<TabsContextData>(tabsContextDefaultValue)

type GenericTabsProps = {
  children: ReactNode
  defaultId?: string
}

export const Tabs: VFC<GenericTabsProps> = ({ children, defaultId }) => {
  const [currentTab, setCurrentTab] = useState<string>(defaultId || '')

  if (window.location.hash) {
    defaultId = window.location.hash.substr(1)
  }

  return (
    <TabsContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export const useTabState = () => useContext<TabsContextData>(TabsContext)

type SharedTabProps = {
  as?: keyof JSX.IntrinsicElements
  activeClassName?: string
  className?: string
  id: string
}

type TabProps = SharedTabProps & {
  children: (props?: any) => ReactElement
}

export const Tab: FC<TabProps> = ({
  as: CustomTag = 'li',
  activeClassName,
  className,
  id,
  children,
}) => {
  const { currentTab, setCurrentTab }: TabsContextData = useTabState()
  const active = currentTab === id

  const href = `#${id}`
  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    setCurrentTab(id)
  }

  return (
    <CustomTag
      className={classNames(className, active && activeClassName)}
      onClick={onClick}
    >
      {children({
        active,
        href,
        id: `#tab-${id}`,
        onClick,
      })}
    </CustomTag>
  )
}

type TabPanelProps = SharedTabProps & {
  children: ReactNode
}

export const TabPanel = ({
  as: CustomTag = 'div',
  className,
  id,
  children,
}: TabPanelProps) => {
  const { currentTab }: TabsContextData = useTabState()
  const active = currentTab === id

  if (active) {
    return (
      <CustomTag
        className={className}
        role="tabpanel"
        id={id}
        aria-labelledby={`tab-${id}`}
      >
        {children}
      </CustomTag>
    )
  }

  return null
}

export type TabListProps = {
  id: string
  label?: string
  disabled?: boolean
  href?: string
}

type OptionType = {
  id: string
  label: string
  href?: string
}

export type SelectMenuProps = {
  loading?: boolean
  options: OptionType[]
  switchTab: (option: TabListProps) => void
  activeTab?: string
  setTab?: string
}

const SelectMenu = ({
  loading,
  options,
  setTab,
  switchTab,
}: SelectMenuProps) => {
  const selectOptions: SelectValue[] = options.map((t) => ({
    value: t.id,
    label: t.label,
    id: t.id,
    href: t.href,
  }))

  const value = find<SelectValue>(selectOptions, {
    value: setTab,
  })

  return loading ? (
    <Skeleton className="w-full h-auto z-60" />
  ) : (
    <Select
      className="w-full h-auto z-60"
      value={value}
      options={selectOptions}
      onValueChange={(option) => {
        const tabOption = {
          id: option.id || option.value,
          href: option.href,
          label: option.label,
        }
        switchTab(tabOption)
      }}
      getOptionValue={(option: SelectValue) => option.label}
    />
  )
}

export type TabRowResponsiveProps = {
  loading?: boolean
  tabs: TabListProps[]
  switchTab: (option: TabListProps) => void
  activeTab?: string
}

export const TabRowResponsive = ({
  loading,
  switchTab,
  activeTab,
  tabs,
}: TabRowResponsiveProps) => {
  const { isTablet } = useWindowSize()
  const { asPath } = useRouter()
  const { formatMessage, locale } = useIntl()
  const base = `/${locale}/dashboard/`
  const url = asPath.split('?')[0].replace(base, '')

  //@TODO: determine based on options.length and the string.length of those tabs
  const options = tabs.map((t) => ({
    ...t,
    label: formatMessage({ id: t.label }) || t.label || t.id,
  }))

  const matchUrlTabId = options.find((o) => new RegExp(`^${o.id}$`).test(url))

  const setTab = activeTab || matchUrlTabId?.id

  if (isTablet) {
    return (
      <SelectMenu
        loading={loading}
        options={options}
        setTab={setTab}
        switchTab={switchTab}
      />
    )
  }

  const buttonClass = 'mr-4 p-4 rounded hover:bg-lightGray w-auto'

  return (
    <div className="w-auto flex flex-shrink-0">
      {options.map((props, i) =>
        loading ? (
          <Skeleton className={buttonClass} width={props.label.length * 25} />
        ) : (
          <button
            key={i}
            disabled={props.disabled}
            onClick={() => switchTab({ id: props.id, href: props.href })}
            className={classNames(buttonClass, {
              'bg-white font-bold': setTab === props.id,
            })}
            {...props}
          >
            {props.label}
          </button>
        )
      )}
    </div>
  )
}
