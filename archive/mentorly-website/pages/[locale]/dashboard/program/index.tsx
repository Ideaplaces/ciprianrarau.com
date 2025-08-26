import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import GroupForm from 'components/Dashboard/Members/GroupForm'
import { ProgramMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import TypedQuery from 'components/Graphql/TypedQuery'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardProgramPageQuery,
  DashboardProgramPageQueryVariables,
  GroupFormFieldsFragmentDoc,
  useDashboardProgramPageQuery,
} from 'types/graphql'

gql`
  query dashboardProgramPage($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      ...GroupFormFields
    }
  }
  ${GroupFormFieldsFragmentDoc}
`

const Program = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  return (
    <div className="max-w-4xl">
      <TypedQuery<DashboardProgramPageQueryVariables>
        variables={{ groupId: currentGroup.id as string }}
        typedQuery={useDashboardProgramPageQuery}
        skip={!currentGroup}
      >
        {({ group }: DashboardProgramPageQuery) => {
          if (!group) {
            toast.error(formatMessage({ id: 'error.unknown' }))
            console.error('no group found')
            return null
          }

          return (
            <>
              <ProgramMenu />
              <div className="w-full">
                <Panel>
                  <Panel.Body>
                    <GroupForm group={group} />
                  </Panel.Body>
                </Panel>
              </div>
            </>
          )
        }}
      </TypedQuery>
    </div>
  )
}

Program.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Program)
export default Program
