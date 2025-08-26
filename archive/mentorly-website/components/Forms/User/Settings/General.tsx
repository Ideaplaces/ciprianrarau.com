import { gql } from '@apollo/client'
import Button from 'components/Button'
import CheckBox from 'components/controls/CheckBox'
import DatePicker from 'components/controls/DatePicker'
import Field from 'components/controls/Field'
import LanguageSelect from 'components/controls/LanguageSelect'
import RecordSelect from 'components/controls/RecordSelect'
import TimezoneSelect from 'components/controls/TimezoneSelect'
import Feature, { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import TypedMutation from 'components/Graphql/TypedMutation'
import { useFormikContext } from 'formik'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { groupHost } from 'lib/urls'
import { FC, MouseEvent } from 'react'
import { useIntl } from 'react-intl'
import {
  Cohort,
  Maybe,
  Tag,
  useArchiveUserMutation,
  useDeleteUserMutation,
  UserSettingsGeneralFieldsFragment,
  useUnarchiveUserMutation,
} from 'types/graphql'

gql`
  fragment UserSettingsGeneralFields on ManagedUser {
    activated
    approvedMentor
    archivedAt
    bookingLink
    cohort {
      id
      name
    }
    contactEmail
    dateOfBirth
    email
    extensionNumber
    externalId
    featuredMentor
    id
    mentor
    onboarded
    onboardingPercent
    phoneNumber
    preferredLanguage {
      id
      code
      name
    }
    tags {
      id
      name(locale: $locale)
    }
    timezone
  }
`

type GeneralSettingsProps = {
  cohorts: Cohort[]
  tags: Tag[]
  user?: Maybe<UserSettingsGeneralFieldsFragment>
  values: Record<string, any>
}

const GeneralSettings: FC<GeneralSettingsProps> = ({
  cohorts,
  tags,
  user,
  values,
}) => {
  const { isDashboard, currentGroup } = useCurrentGroup()
  const { isSubmitting } = useFormikContext()
  const { formatMessage, locale } = useIntl()
  const { push } = useRouter()

  return (
    <>
      {isDashboard && user?.archivedAt && (
        <Alert type="warning" className="mb-2">
          This user is archived.
        </Alert>
      )}
      {isDashboard && <Field name="name" />}
      <div className="sm:flex gap-4">
        <Field name="email" strip className="sm:w-1/2" />
        <Field name="contactEmail" strip className="sm:w-1/2" />
      </div>
      <div className="sm:flex gap-4">
        <Field name="phoneNumber" className="sm:w-1/2" />
        <Field name="extensionNumber" className="sm:w-1/2" />
      </div>
      <div className="sm:flex gap-4">
        <Field
          name="dateOfBirth"
          className="sm:w-1/2"
          type="date"
          control={DatePicker}
          minDate={new Date(1850, 0, 1)}
          placeholder={formatMessage({ id: 'util.selectDate' })}
          adultBirthDate
          full
        />
        <Field
          name="timezone"
          type="select"
          control={TimezoneSelect}
          placeholder={formatMessage({
            id: 'field.placeholder.selectTimezone',
          })}
          className="sm:w-1/2"
          tooltipProps={{
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }}
        />
      </div>
      <div className="sm:flex">
        <Field
          name="preferredLanguage"
          type="select"
          control={LanguageSelect}
          mainOnly
        />
      </div>

      {isDashboard && (
        <>
          <Feature id="bookingLink">
            <Field name="bookingLink" />
          </Feature>
          <Field
            name="cohort"
            type="select"
            control={RecordSelect}
            options={cohorts}
            isMulti={false}
          />
          {/* @TODO: pluralize/singularize if tag limit is 1 */}
          <Field
            name="tags"
            type="select"
            control={RecordSelect}
            options={tags}
            isMulti={getFeatureFlag(currentGroup, 'tagLimit') !== 1}
          />
          <Field type="checkbox" name="mentor" control={CheckBox} />
          {values.mentor === true && (
            <>
              <Field type="checkbox" name="approvedMentor" control={CheckBox} />
              <Field type="checkbox" name="featuredMentor" control={CheckBox} />
            </>
          )}
          <Field type="checkbox" name="onboarded" control={CheckBox} />
          <Field type="checkbox" name="activated" control={CheckBox} />
        </>
      )}

      {isDashboard && (
        <div className="flex justify-between">
          <Button loading={isSubmitting} type="submit">
            {formatMessage({ id: 'button.save' })}
          </Button>
          <div className="flex space-x-2">
            <TypedMutation
              typedMutation={
                user?.archivedAt
                  ? useUnarchiveUserMutation
                  : useArchiveUserMutation
              }
              notification={formatMessage({
                id: `term.${user?.archivedAt ? 'unarchived' : 'archived'}`,
              })}
              refetchQueries={['dashboardMembers']}
              variables={{ id: user?.id }}
            >
              {({ onClick }) => (
                <Button
                  loading={isSubmitting}
                  variant="secondary"
                  onClick={onClick}
                  color={user?.archivedAt ? 'green' : 'orange'}
                >
                  {formatMessage({
                    id: `button.${user?.archivedAt ? 'unarchive' : 'archive'}`,
                  })}
                </Button>
              )}
            </TypedMutation>

            <TypedMutation
              typedMutation={useDeleteUserMutation}
              notification={formatMessage({
                id: 'toast.success.deleted',
              })}
              onSuccess={() =>
                push(`${groupHost(currentGroup)}/${locale}/dashboard/members`)
              }
              refetchQueries={['dashboardMembers']}
              variables={{ id: user?.id }}
            >
              {({ onClick }: { onClick: (e: MouseEvent) => void }) => (
                <Button
                  loading={isSubmitting}
                  variant="secondary"
                  onClick={(e: MouseEvent) => {
                    confirm(formatMessage({ id: 'prompt.areYouSure' }))
                      ? onClick(e)
                      : false
                  }}
                  color="red"
                >
                  {formatMessage({ id: 'button.delete' })}
                </Button>
              )}
            </TypedMutation>
          </div>
        </div>
      )}
    </>
  )
}

export default GeneralSettings
