import { createContext, FC, ReactNode, useContext } from 'react'
import { InputMaybe } from 'types/graphql'

const ScheduleContext = createContext<ScheduleType>({ activeDate: new Date() })

type ScheduleType = {
  activeDate: Date
  bookingDuration?: number
  disciplineFilters?: InputMaybe<string | string[]>
  locationFilter?: any
  intervalFilter?: number[]
  openMentorCard?: boolean | null
  eventCountForActiveDate?: unknown
  setIntervalFilter?: (range: number[]) => void
  setEventCountForActiveDate?: (...args: any) => void
  setActiveDate?: (...args: any) => void
  setBookingDuration?: (...args: any) => void
  setDisciplineFilters?: (...args: any) => void
  setLocationFilter?: (...args: any) => void
  setOpenMentorCard?: (...args: any) => void
}

type ScheduleProviderProps = {
  schedule: ScheduleType // @TODO: update when improving or deciding to keep Schedule feature
  children: ReactNode
  [x: string]: any
}
export const ScheduleProvider: FC<ScheduleProviderProps> = ({
  schedule,
  children,
}) => {
  return (
    <ScheduleContext.Provider value={schedule}>
      {children}
    </ScheduleContext.Provider>
  )
}

export const useSchedule = () => {
  return useContext(ScheduleContext)
}

export default ScheduleContext
