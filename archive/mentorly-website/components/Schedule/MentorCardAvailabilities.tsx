import { gql } from '@apollo/client'
import Booking from 'components/Booking'
import UserLocation from 'components/display/UserLocation'
import FormatDateTime from 'components/general/DateTime'
import { useModal } from 'components/Modal/ModalContext'
import { timezone } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import Select, { StylesConfig } from 'react-select'
import {
  BookingLocationFieldsFragmentDoc,
  Maybe,
  MentorScheduleCardAvailabilitiesFragment,
} from 'types/graphql'

gql`
  fragment MentorScheduleCardAvailabilities on Availability {
    id
    startTime
    endTime
    location {
      ...BookingLocationFields
    }
  }
  ${BookingLocationFieldsFragmentDoc}
`

type MentorCardAvailabilitiesProps = {
  availabilities: MentorScheduleCardAvailabilitiesFragment[]
  mentor: {
    id: string
    name: string
  }
}

type ScheduleAvailabilityOption = Maybe<{ value: any; label: any }> | undefined

const presence = (value?: string | null) => {
  if (value && value.length > 0) {
    return value
  }

  return undefined
}

export const MentorCardAvailabilities: VFC<MentorCardAvailabilitiesProps> = ({
  availabilities,
  mentor,
}) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { showModal, hideModal } = useModal()

  const [selectedTime, setSelectedTime] =
    useState<ScheduleAvailabilityOption>(undefined)

  useEffect(() => {
    if (selectedTime?.value) {
      const { startTime, endTime, location } = selectedTime.value
      const booking = {
        startTime: startTime,
        endTime: endTime,
        location: location,
      }
      showModal({
        width: 'xl',
        padding: 'p-12',
        callback: () => setSelectedTime(undefined),
        content: (
          <Booking
            member={mentor}
            sessionType="Individual"
            bookingTimes={booking}
            close={hideModal}
          />
        ),
      })
    }
  }, [selectedTime])

  if (!(availabilities?.length > 0))
    return (
      <p className="p-5 pt-10 opacity-60">
        {formatMessage({ id: 'booking.unavailable' })}
      </p>
    )

  const options = availabilities?.map((hour) => {
    return {
      value: hour,
      label: (
        <div className="flex flex-wrap justify-between w-full">
          <FormatDateTime
            date={new Date(hour.startTime)}
            endDate={new Date(hour.endTime)}
            format="date.time"
          />
          {(currentGroup?.locations?.length || 0) > 0 && (
            <UserLocation>
              <span className="opacity-60 whitespace-nowrap">
                {hour.location ? hour.location.name : 'online'}
              </span>
            </UserLocation>
          )}
        </div>
      ),
    }
  })

  const selectedBg =
    presence(currentGroup?.styles?.backgroundColor) || '#ececec'
  const selectedText =
    presence(currentGroup?.styles?.backgroundTextColor) || '#000'
  const accentColor = presence(currentGroup?.styles?.accentColor) || 'black'

  const customStyles: StylesConfig = {
    option: (provided, { isSelected, isFocused }) => ({
      ...provided,
      backgroundColor: isSelected ? selectedBg : 'white',
      color: isSelected ? selectedText : 'black',
      padding: '0.75rem 2rem 0.75rem 2rem',
      opacity: isFocused ? '30' : '100',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: accentColor,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
    control: () => ({
      borderRadius: '4px',
      border: '1px solid rgba(204, 204, 204, 0.30)',
      display: 'flex',
      backgroundColor: 'white',
      padding: '0.5rem',
      width: '100%',
    }),
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      opacity: isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      width: 'calc(100% - 10px)',
    }),
  }

  const placeholderMsg = formatMessage({ id: 'placeholder.selectTime' })
  const tz = timezone(new Date(availabilities[0]?.startTime), locale)

  return (
    <div className="-ml-2 sm:ml-0 w-full flex flex-col h-28 sm:h-22 sm:pt-4 justify-center cursor-pointer">
      <Select
        name="availabilitiesSelect"
        options={options}
        value={selectedTime}
        isClearable={true}
        onChange={(newValue: unknown) =>
          setSelectedTime(newValue as ScheduleAvailabilityOption)
        }
        placeholder={`${placeholderMsg} (${tz}):`}
        styles={customStyles}
      />
    </div>
  )
}

export default MentorCardAvailabilities
