import { gql } from '@apollo/client'
import { SocialIcon } from 'components/icons/SocialIcon'
import { FC } from 'react'
import { CalendarLink } from 'types/graphql'

export const CalendarLinksFields = gql`
  fragment CalendarLinksFields on CalendarLink {
    provider
    url
  }
`

export type CalendarIconLinksProps = {
  calendarLinks?: CalendarLink[]
}

const CalendarIconLinks: FC<CalendarIconLinksProps> = ({ calendarLinks }) => (
  <div className="w-full flex flex-wrap justify-start gap-4">
    {calendarLinks?.map(({ provider, url }, i: number) => (
      <div key={i} className="text-center w-auto">
        <a href={url} target="_blank" rel="noreferrer">
          <SocialIcon type={provider.toLowerCase()} size="48" />
          {provider}
        </a>
      </div>
    ))}
  </div>
)

export default CalendarIconLinks
