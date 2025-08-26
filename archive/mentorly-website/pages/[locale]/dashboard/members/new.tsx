import { gql } from '@apollo/client'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import MemberForms from 'components/Dashboard/Members/Form'
import Panel from 'components/display/Panel'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { FormikHelpers, FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { omit } from 'lodash'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardMemberFiltersQuery,
  DashboardMemberFiltersQueryVariables,
  useCreateUserMutation,
  useDashboardMemberFiltersQuery,
} from 'types/graphql'

gql`
  mutation createUser($groupId: ID!, $attributes: UserAttributes!) {
    createUser(groupId: $groupId, attributes: $attributes) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

const initialValues = {
  name: '',
  contactEmail: '',
  mentor: false,
  approvedMentor: true,
}

const Member = () => {
  const [createUser] = useCreateUserMutation()
  const { push } = useRouter()
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const handleSubmit = (
    values: FormikValues,
    formikBag: FormikHelpers<FormikValues>
  ) => {
    const attributes = omit(values, [
      'profileImageUrl',
      'socialLinks',
      'disciplines',
    ])

    createUser({
      refetchQueries: ['dashboardMembers'],
      variables: {
        groupId: currentGroup.id,
        attributes: formatMutationVariables(attributes, {
          cohort: 'id',
          discipline: 'id',
          subdisciplines: 'id',
          languages: 'code',
          preferredLanguage: 'code',
          tags: 'id',
        }),
      },
    })
      .then((results) => {
        formikBag.setSubmitting(false)
        if (results.data?.createUser.errors.length !== 0) {
          results.data?.createUser.errors.forEach((err: any) => {
            toast.error(err)
            console.error(err)
          })
        } else {
          toast.success('Created!')
          // @TODO: refetch a better query instead
          push(
            `/${locale}/dashboard/members/${results?.data?.createUser?.user?.id}`
          )
        }
      })
      .catch((e) => {
        formikBag.setSubmitting(false)
        toast.error('Could not create user')
        console.error(e)
      })
  }

  return (
    <TypedQuery<DashboardMemberFiltersQueryVariables>
      typedQuery={useDashboardMemberFiltersQuery}
      variables={{ groupId: currentGroup?.id }}
      skip={!currentGroup}
    >
      {({ refetch, group }: TypedQueryReturn & DashboardMemberFiltersQuery) => {
        if (!group) {
          toast.error(formatMessage({ id: 'error.unknown' }))
          console.error('no group found')
          return null
        }

        return (
          <div>
            <Heading>{formatMessage({ id: 'header.newMembers' })}</Heading>
            <Panel>
              <Panel.Body>
                <MemberForms
                  group={group}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  refetch={refetch}
                  newMember
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
