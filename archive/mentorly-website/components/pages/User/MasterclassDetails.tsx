import { gql } from '@apollo/client'
import FormatDateTime from 'components/general/DateTime'
import JoinButton from 'components/Sessions/JoinButton'
import { parseISO } from 'date-fns'
import React, { VFC } from 'react'
import { Calendar, Clock } from 'react-feather'
import {
  JoinButtonFieldsFragmentDoc,
  MasterclassDetailsFieldsFragment,
} from 'types/graphql'

gql`
  fragment MasterclassDetailsFields on Booking {
    id
    title
    description
    startTime
    endTime
    ...JoinButtonFields
  }
  ${JoinButtonFieldsFragmentDoc}
`

type MasterclassDetailsProps = {
  masterclass: MasterclassDetailsFieldsFragment
}

const MasterclassDetails: VFC<MasterclassDetailsProps> = ({ masterclass }) => {
  const startTime = parseISO(masterclass.startTime)
  const endTime = parseISO(masterclass.endTime)

  return (
    <div id={`sessionId-${masterclass.id}`}>
      <h3 className="font-extrabold">{masterclass.title}</h3>
      <div className="flex space-x-2 items-center">
        <Calendar size="16" color="#bbb" className="mr-2" />
        <FormatDateTime date={startTime} format="date.fullDate" />
      </div>
      <div className="flex space-x-2 items-center">
        <Clock size="16" color="#bbb" className="mr-2" />
        <FormatDateTime
          date={startTime}
          endDate={endTime}
          format="date.time"
          showTZ
        />
      </div>
      <p className="mt-2 mb-4">{masterclass.description}</p>
      <span className="flex items-center space-x-6">
        <JoinButton booking={masterclass} showTooltip />
      </span>
    </div>
  )
}

export default MasterclassDetails
