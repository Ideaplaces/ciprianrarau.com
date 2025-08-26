import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import Form from 'components/controls/Form'
import DashboardLayout, { LayoutProps } from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import UserProfile from 'components/Forms/User/Profile'
import profileSchema from 'components/Forms/User/schema'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { FormikHelpers, FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import initialValues from 'lib/initialValues'
import { connectServerSideProps } from 'lib/ssg'
import { profileUrl } from 'lib/urls'
import { omit } from 'lodash'
import { FC, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  UserProfileFieldsFragmentDoc,
  UserProfileQuery,
  UserProfileQueryVariables,
  useUpdateUserMutation,
  useUserProfileQuery,
} from 'types/graphql'

gql`
  query userProfile {
    disciplines {
      id
      imageUrl
      name
      slug
      subdisciplines {
        id
        name
        slug
      }
    }
    viewer {
      ...UserProfileFields
    }
  }
  ${UserProfileFieldsFragmentDoc}
`

type ProfileSubComponentsProps = {
  Layout: FC<LayoutProps>
}

const Profile: VFC & ProfileSubComponentsProps = () => {
  const { currentGroup } = useCurrentGroup()
  const [mentorToggle, setMentor] = useState<boolean | null>(null)
  const { formatMessage, locale } = useIntl()

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['viewerOnboardingProgress'],
  })

  return (
    <TypedQuery<UserProfileQueryVariables>
      typedQuery={useUserProfileQuery}
      variables={{}}
    >
      {({
        viewer,
        disciplines,
        refetch,
      }: TypedQueryReturn & UserProfileQuery) => {
        if (!viewer) {
          console.error('cannot find user')
          return null
        }

        const onSubmit = (
          values: FormikValues,
          formikBag: FormikHelpers<FormikValues>
        ) => {
          const newValues = omit(values, ['profileImageUrl', 'discipline'])

          // @TODO: remove readOnly fields from config to ensure they are not accidentally edited

          const attributes = formatMutationVariables(newValues, {
            cohort: 'id',
            disciplines: 'id',
            subdisciplines: 'id',
            languages: 'code',
            preferredLanguage: 'code',
            tags: 'id',
          })
          // @TODO: we do the same thing almost everywhere
          // we get the data, setSubmitting, check for errors, show toast
          // we should be consistent and just reuse a confirmPayload()
          // and let Form handle the display of errors
          updateUser({ variables: { id: viewer?.id, attributes } })
            .then(({ data }) => {
              const { errorDetails } = data?.updateUser || {}
              formikBag.setSubmitting(false)
              refetch()
              if (errorDetails && Object.keys(errorDetails).length > 0) {
                throw Error(errorDetails)
              } else {
                toast.success(formatMessage({ id: 'term.saved' }))
              }
            })
            .catch((err) => {
              toast.error(formatMessage({ id: 'term.error' }))
              console.error(err)
            })
        }

        const values =
          viewer &&
          initialValues(
            viewer,
            [
              'name',
              'pronouns',
              'behanceLink',
              'company',
              'description',
              'discipline',
              'disciplines',
              'dribbbleLink',
              'experience',
              'facebookLink',
              'instagramLink',
              'linkedinLink',
              'mentor',
              'profileImageUrl',
              'role',
              'skills',
              'languages',
              'location',
              'shortTermGoals',
              'longTermGoals',
              'slug',
              'subdisciplines',
              'twitterLink',
              'vimeoLink',
              'website',
              'welcomeMessage',
              'youtubeLink',
              'countryCode',
            ],
            {
              description: '',
              skills: '',
              role: '',
              welcomeMessage: '',
            }
          )

        const mentor = mentorToggle === null ? viewer.mentor : mentorToggle

        const buttonData = {
          ...viewer,
          mentor,
        }

        return (
          <Panel className="max-w-4xl pr-2">
            <Panel.Header>
              {formatMessage({ id: 'header.profile' })}
              <ButtonLink
                target="_blank"
                className="ml-5"
                href={profileUrl(buttonData, locale)}
              >
                {formatMessage({ id: 'menu.viewProfile' })}
              </ButtonLink>
            </Panel.Header>
            <Panel.Body>
              <Form
                id="userProfile"
                initialValues={values}
                onSubmit={onSubmit}
                validationSchema={profileSchema(currentGroup, viewer)}
                validateOnChange={false}
                validateOnBlur={false}
                showErrorSummary
                confirmUnsaved
                enableReinitialize
              >
                {({ values }: any) => (
                  <UserProfile
                    group={currentGroup}
                    user={viewer}
                    isSelf
                    disciplines={
                      currentGroup ? currentGroup.disciplines : disciplines
                    }
                    refetch={refetch}
                    formValues={values}
                    page="personal"
                    mentor={mentor}
                    setMentor={setMentor}
                  />
                )}
              </Form>
            </Panel.Body>
          </Panel>
        )
      }}
    </TypedQuery>
  )
}

Profile.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Profile)
export default Profile
