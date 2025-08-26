import React, { Dispatch, ElementType, SetStateAction } from 'react'

export type GenericTabsProps = {
  children: React.ReactNode
  defaultId?: string
}

export type TabsContextData = {
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
}

export type TabProps = {
  activeClassName?: string
  className?: string
  id: string
  children: React.ReactNode
  as?: ElementType
}

export type TabListProps = {
  id: string
  label?: string
  disabled?: boolean
  href?: string
}

export type TabRowResponsiveProps = {
  tabs: Array<TabListProps>
  switchTab: (option: TabListProps) => void
  activeTab?: string
}
export type LocationType = {
  id: string
  name: string
  fullName: string
  address: string
  premise?: string
  administrativeArea?: string
  locality?: string
  postalCode?: string
  thoroughfare?: string
  country?: string
}

// @TODO: these will be replaced with the generated apollo types
export type User = {
  id: string
  [x: string]: any
}
export type Group = {
  id: string
  slug: string
  [x: string]: any
}
export type Discipline = {
  id: string
  name: string
  [x: string]: any
}

export type Booking = {
  id: string
  participants: User[]
  group: Group
  groupSession: boolean
  mentor: User
  location?: LocationType
  sessionType: string
}
