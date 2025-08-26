import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import AddCohortButton from 'components/Dashboard/Members/AddCohortButton'
import CohortInfo from 'components/Dashboard/Members/CohortsInfo'
import Table from 'components/Dashboard/Members/CohortsTable'
import { MembersMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import TypedQuery from 'components/Graphql/TypedQuery'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  DashboardCohortsQueryVariables,
  useCreateCohortMutation,
  useDashboardCohortsQuery,
  useUpdateCohortMutation,
} from 'types/graphql'

gql`
  query dashboardCohorts($groupId: ID!, $locale: String = "en") {
    group: managedGroup(id: $groupId) {
      id
      name
      cohorts {
        id
        name
      }
      tags {
        id
        name(locale: $locale)
        nameEn: name(locale: "en")
        nameFr: name(locale: "fr")
        isFiltering
        isPublic
      }
    }
  }

  mutation updateCohort($id: ID!, $attributes: CohortAttributes!) {
    updateCohort(id: $id, attributes: $attributes) {
      cohort {
        id
        name
      }
      errors
      errorDetails
    }
  }

  mutation createCohort($groupId: ID!, $attributes: CohortAttributes!) {
    createCohort(groupId: $groupId, attributes: $attributes) {
      cohort {
        id
        name
      }
      errors
      errorDetails
    }
  }
`

const Program = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  return (
    <TypedQuery<DashboardCohortsQueryVariables>
      typedQuery={useDashboardCohortsQuery}
      skip={!currentGroup?.id}
      variables={{ groupId: currentGroup.id }}
    >
      {({ group }) => {
        if (!group) {
          console.error('no group')
          return null
        }

        const { id, cohorts } = group
        return (
          <>
            <MembersMenu />
            <CohortInfo />
            <Panel>
              <Panel.Header>
                {formatMessage({ id: 'header.cohortsAndTags.cohorts' })}
                <AddCohortButton
                  typedMutation={useCreateCohortMutation}
                  groupId={id}
                />
              </Panel.Header>
              <Panel.Body>
                <Table data={cohorts} typedMutation={useUpdateCohortMutation} />
              </Panel.Body>
            </Panel>
          </>
        )
      }}
    </TypedQuery>
  )
}

Program.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Program)
export default Program
