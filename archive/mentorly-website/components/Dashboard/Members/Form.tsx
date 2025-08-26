import { gql } from '@apollo/client'
import Form from 'components/controls/Form'
import { Tab, TabList, TabPanel, Tabs } from 'components/display/Tabs'
import { getFeatureFlag } from 'components/Feature'
import UserProfile from 'components/Forms/User/Profile'
import profileSchema from 'components/Forms/User/schema'
import UserSettings from 'components/Forms/User/Settings/General'
import { DashboardSettingsSchema } from 'components/Forms/User/Settings/UserSettingsSchemas'
import { FormikValues } from 'formik'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  DashboardMemberFormGroupFieldsFragment,
  GroupMemberMatchesFieldsFragmentDoc,
  MemberAvailabilityFieldsFragmentDoc,
  MemberBookingsFieldsFragmentDoc,
  MemberMatchesFieldsFragmentDoc,
  MemberProfileFieldsFragmentDoc,
  UserSettingsGeneralFieldsFragmentDoc,
} from 'types/graphql'

import MemberAvailability from './MemberAvailability'
import MemberBookings from './MemberBookings'
import MemberMatches from './MemberMatches'
import MemberSurvey from './MemberSurvey'

gql`
  fragment DashboardMemberFormGroupFields on ManagedGroup {
    id
    requiresPayment
    slug
    tags {
      id
      key
      isFiltering
      isPublic
      name
      nameEn
      nameFr
    }
    disciplines {
      id
      name(locale: $locale)
      slug
      subdisciplines {
        id
        name(locale: $locale)
        slug
      }
    }
    cohorts {
      id
      name
    }
    member(id: $id) {
      id
      uid
      status
      externalUserUrl
      onboardingPercent
      ...MemberBookingsFields
      ...MemberAvailabilityFields
      ...MemberProfileFields
      ...UserSettingsGeneralFields
      ...MemberMatchesFields
    }
    ...GroupMemberMatchesFields
  }
  ${MemberBookingsFieldsFragmentDoc}
  ${MemberMatchesFieldsFragmentDoc}
  ${GroupMemberMatchesFieldsFragmentDoc}
  ${MemberAvailabilityFieldsFragmentDoc}
  ${MemberProfileFieldsFragmentDoc}
  ${UserSettingsGeneralFieldsFragmentDoc}
`

type MemberFormProps = {
  initialValues: Record<string, any>
  group: DashboardMemberFormGroupFieldsFragment
  defaultTab?: string
  onSubmit: (values: FormikValues, props?: any) => void
  newMember?: boolean
  refetch: () => void
}
const MemberForm: FC<MemberFormProps> = ({
  initialValues,
  group,
  defaultTab,
  onSubmit,
  newMember,
  refetch,
}) => {
  const { formatMessage } = useIntl()
  const { cohorts, disciplines, tags, member } = group

  if (!group) return null

  return (
    <Tabs defaultId={defaultTab || 'info'}>
      <TabList>
        <Tab id="info">{formatMessage({ id: 'menu.info' })}</Tab>
        <Tab id="profile">{formatMessage({ id: 'menu.profile' })}</Tab>
        {!newMember && (
          <>
            <Tab id="bookings">{formatMessage({ id: 'term.bookings' })}</Tab>
            {getFeatureFlag(group, 'sidebar.availabilities') && (
              <Tab id="availability">
                {formatMessage({ id: 'menu.availabilities' })}
              </Tab>
            )}
            <Tab id="matching">{formatMessage({ id: 'menu.matching' })}</Tab>
            <Tab id="survey">{formatMessage({ id: 'menu.survey' })}</Tab>
          </>
        )}
      </TabList>
      <TabPanel id="info" className="max-w-3xl">
        <Form
          id="dashboardMemberSettings"
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={DashboardSettingsSchema}
        >
          {({ values }: FormikValues) => (
            <UserSettings
              user={member}
              cohorts={cohorts}
              tags={tags}
              values={values}
            />
          )}
        </Form>
      </TabPanel>
      <TabPanel id="profile" className="max-w-3xl">
        <Form
          id="dashboardMemberProfile"
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={member && profileSchema(group, member)}
          // page="dashboard"
        >
          {({ values }: FormikValues) => (
            <UserProfile
              user={member}
              group={group}
              disciplines={disciplines}
              formValues={values}
              refetch={refetch}
              mentor={member?.mentor}
            />
          )}
        </Form>
      </TabPanel>
      {!newMember && member && (
        <>
          <TabPanel id="matching" className="max-w-3xl">
            <MemberMatches group={group} />
          </TabPanel>
          <TabPanel id="bookings" className="max-w-3xl">
            <TimezoneBanner />
            <MemberBookings member={member} />
          </TabPanel>
          {getFeatureFlag(group, 'sidebar.availabilities') && (
            <TabPanel id="availability" className="max-w-3xl">
              <TimezoneBanner />
              <MemberAvailability member={member} />
            </TabPanel>
          )}
          <TabPanel id="survey" className="max-w-3xl">
            <MemberSurvey group={group} />
          </TabPanel>
        </>
      )}
    </Tabs>
  )
}

const TimezoneBanner = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="pb-4 text-darkGray">
      {formatMessage(
        {
          id: 'form.members.timezone',
        },
        { tz: Intl.DateTimeFormat().resolvedOptions().timeZone }
      )}
    </div>
  )
}

export default MemberForm
