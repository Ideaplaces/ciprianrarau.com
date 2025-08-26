import Field from 'components/controls/Field'
import SessionLocationSelect from 'components/controls/SessionLocationSelect'
import TypedQuery from 'components/Graphql/TypedQuery'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { addressFromLocation } from 'lib/urls'
import { userIsPM } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { isEmpty, pick } from 'lodash'
import { VFC } from 'react'
import { MapPin } from 'react-feather'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tippy'
import {
  BookingLocationFieldsFragment,
  GroupLocationsQuery,
  GroupLocationsQueryVariables,
  Maybe,
  useGroupLocationsQuery,
} from 'types/graphql'

gql`
  query groupLocations($groupId: ID!, $locationIds: [ID!], $locale: String) {
    group(id: $groupId) {
      locations(ids: $locationIds) {
        id
        ...BookingLocationFields
      }
    }
  }
  fragment BookingLocationFields on Location {
    id
    key
    group {
      id
      slug
    }
    name(locale: $locale)
    address(locale: $locale)
    premise(locale: $locale)
    fullName(locale: $locale)
    administrativeArea(locale: $locale)
    locality(locale: $locale)
    postalCode
    thoroughfare(locale: $locale)
    country(locale: $locale)
  }
`
type LocationNameProps = {
  location?: Maybe<BookingLocationFieldsFragment>
  shorten?: boolean
  withLink?: boolean
}

const LocationName: VFC<LocationNameProps> = ({
  location,
  shorten,
  withLink,
}) => {
  const { mapUrl, addressString, fullName, name } =
    addressFromLocation(location)

  const { formatMessage } = useIntl()

  const text = shorten ? fullName || name : addressString

  if (!location) {
    return <>{formatMessage({ id: 'term.online' })}</>
  }

  if (withLink) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="w-100 text-highlightColor break-words"
      >
        {text}
      </a>
    )
  }

  return <>{text}</>
}

export type LocationProps = LocationNameProps & {
  showIcon?: boolean
}

const Location: VFC<LocationProps> = ({ showIcon, ...nameProps }) => {
  return showIcon ? (
    <div className="flex items-start justify-start">
      <MapPin size={24} className="h-5 flex-0 mr-1" />
      <span className="flex flex-1 flex-col space-x-2">
        <LocationName {...nameProps} />
      </span>
    </div>
  ) : (
    <LocationName {...nameProps} />
  )
}

export type LocationFieldProps = {
  location?: Maybe<BookingLocationFieldsFragment>
}

export const LocationField: VFC<LocationFieldProps> = ({ location }) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser }: any = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const isPM = userIsPM(currentUser, currentGroup)

  const variables = {
    groupId: currentGroup.id,
    locationIds: location ? [location?.id] : undefined,
    locale,
  }

  return (
    <TypedQuery<GroupLocationsQueryVariables>
      typedQuery={useGroupLocationsQuery}
      variables={variables}
      skip={!currentGroup}
    >
      {({ group }: GroupLocationsQuery) => {
        if (isEmpty(group?.locations)) {
          return null
        }

        const options = group?.locations?.map((o) => pick(o, ['id', 'name']))

        return (
          <Tooltip
            position="top-start"
            arrow={true}
            distance={60}
            theme="light"
            disabled={isPM}
            title={formatMessage({ id: 'tooltip.onlyPMCanEdit' })}
          >
            <Field
              name="location"
              type="location"
              disabled={!isPM}
              control={SessionLocationSelect}
              options={options}
              placeholder={formatMessage({
                id: 'term.selectLocation',
              })}
            />
          </Tooltip>
        )
      }}
    </TypedQuery>
  )
}

export default Location
