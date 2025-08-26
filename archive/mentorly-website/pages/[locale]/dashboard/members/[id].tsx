import { gql } from '@apollo/client'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import MemberForms from 'components/Dashboard/Members/Form'
import ProgressPill from 'components/Dashboard/ProgressPill'
import Panel from 'components/display/Panel'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import TypedMutationButton from 'components/Graphql/TypedMutationButton'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { FormikBag, FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import initialValues from 'lib/initialValues'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { productsUrl } from 'lib/urls'
import { omit } from 'lodash'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardMemberFormGroupFieldsFragmentDoc,
  DashboardMemberPageQuery,
  DashboardMemberPageQueryVariables,
  useDashboardMemberPageQuery,
  useSendOnboardingEmailMutation,
  useUpdateUserMutation,
} from 'types/graphql'

gql`
  query dashboardMemberPage(
    $groupId: ID!
    $id: ID!
    $locale: String
    $matchPage: Int = 1
  ) {
    group: managedGroup(id: $groupId) {
      ...DashboardMemberFormGroupFields
    }
  }
  ${DashboardMemberFormGroupFieldsFragmentDoc}
`

const initialValueFields = [
  'activated',
  'allowGroupSessions',
  'approvedMentor',
  'behanceLink',
  'bookingLink',
  'cohort',
  'company',
  'contactEmail',
  'countryCode',
  'dateOfBirth',
  'description',
  'discipline',
  'disciplines',
  'dribbbleLink',
  'email',
  'experience',
  'extensionNumber',
  'externalId',
  'facebookLink',
  'featuredMentor',
  'instagramLink',
  'languages',
  'linkedinLink',
  'location',
  'longTermGoals',
  'market',
  'mentor',
  'name',
  'onboarded',
  'peopleNetwork',
  'phoneNumber',
  'preferredLanguage',
  'profileImageUrl',
  'pronouns',
  'role',
  'shortTermGoals',
  'skills',
  'slug',
  'socialLinks',
  'subdisciplines',
  'tags',
  'timezone',
  'twitterLink',
  'vimeoLink',
  'website',
  'welcomeMessage',
  'youtubeLink',
]

const Member = () => {
  const [updateUser] = useUpdateUserMutation()
  const { query } = useRouter()
  const { id, tab } = query
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const handleSubmit = (
    values: FormikValues,
    formikBag: FormikBag<any, any>
  ) => {
    const newValues = omit(values, [
      'discipline',
      'profileImageUrl',
      'socialLinks',
      'externalId',
    ])

    // in case group is set to only allow one value for tags
    // make sure to convert to Array for DB
    if (newValues.tags && !Array.isArray(newValues.tags)) {
      newValues.tags = [newValues.tags]
    }

    const attributes = formatMutationVariables(newValues, {
      cohort: 'id',
      disciplines: 'id',
      subdisciplines: 'id',
      languages: 'code',
      preferredLanguage: 'code',
      tags: 'id',
    })

    updateUser({ variables: { id: id as string, attributes } })
      .then(() => {
        formikBag.setSubmitting(false)
        toast.success('Saved!')
      })
      .catch((e) => {
        formikBag.setSubmitting(false)
        toast.error('Could not save user')
        console.error(e)
      })
  }

  return (
    <TypedQuery<DashboardMemberPageQueryVariables>
      typedQuery={useDashboardMemberPageQuery}
      variables={{ groupId: currentGroup.id, id: id as string, locale }}
      skip={!currentGroup}
    >
      {({ refetch, group }: TypedQueryReturn & DashboardMemberPageQuery) => {
        if (!group?.member) {
          return (
            <Alert
              title="Error"
              description={formatMessage({ id: 'error.userNotFound' })}
              type="error"
              className="w-10/12 my-1/12 mx-auto"
              showIcon
            />
          )
        }

        const values =
          getFeatureFlag(group, 'tagLimit') === 1
            ? { ...group.member, tags: group.tags[0] }
            : group.member

        const showInvitationEmailButton = ['pending', 'invited'].includes(
          group.member.status
        )

        const isNotMentor = !group?.member.mentor

        return (
          <div>
            <Heading>
              <Heading.Text>{group.member.name}</Heading.Text>
              <div className="flex gap-3">
                {group?.requiresPayment && isNotMentor && (
                  <Heading.Actions>
                    <a
                      href={productsUrl(locale, group, group.member)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex justify-center border-2 relative select-none whitespace-nowrap bg-black text-white font-bold border-transparent cursor-pointer rounded-full px-8 py-2"
                    >
                      {formatMessage({ id: 'button.viewPayment' })}
                    </a>
                  </Heading.Actions>
                )}
                {group?.member.externalUserUrl && (
                  <Heading.Actions>
                    <a
                      href={group?.member.externalUserUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex justify-center border-2 relative select-none whitespace-nowrap bg-black text-white font-bold border-transparent cursor-pointer rounded-full px-8 py-2"
                    >
                      {formatMessage({ id: 'button.viewZohoProfile' })}
                    </a>
                  </Heading.Actions>
                )}
                {showInvitationEmailButton && (
                  <Heading.Actions>
                    <TypedMutationButton
                      label={formatMessage({
                        id: 'button.sendOnboardingEmail',
                      })}
                      typedMutation={useSendOnboardingEmailMutation}
                      notification={formatMessage({
                        id: 'message.onboardingEmailSent',
                      })}
                      variables={{ id: group.member.id }}
                    />
                  </Heading.Actions>
                )}
              </div>
            </Heading>
            <div className="-mt-3 mb-4 flex items-center justify-start space-x-2">
              <p>{formatMessage({ id: 'header.progress' })}:</p>
              <ProgressPill status={group.member.status} />
            </div>
            <Panel className="max-w-4xl">
              <Panel.Body>
                <MemberForms
                  group={group}
                  refetch={refetch}
                  defaultTab={tab as string}
                  initialValues={initialValues(values, initialValueFields)}
                  onSubmit={handleSubmit}
                />
              </Panel.Body>
            </Panel>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Member.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Member)
export default Member
