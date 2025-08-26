import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { ProgramMenu } from 'components/Dashboard/Menu'
import EmailTemplateForm from 'components/Dashboard/Program/EmailTemplateForm'
import Panel from 'components/display/Panel'
import TypedQuery from 'components/Graphql/TypedQuery'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  DashboardGroupTemplateQuery,
  DashboardGroupTemplateQueryVariables,
  EmailTemplateFormFieldsFragmentDoc,
  useDashboardGroupTemplateQuery,
} from 'types/graphql'

gql`
  query dashboardGroupTemplate($groupId: ID!, $id: ID!, $locale: String) {
    group: managedGroup(id: $groupId) {
      id
      ...EmailTemplateFormFields
    }
  }
  ${EmailTemplateFormFieldsFragmentDoc}
`

const Template = () => {
  const { locale } = useIntl()
  const { query } = useRouter()
  const { id } = query
  const { currentGroup } = useCurrentGroup()

  return (
    <TypedQuery<DashboardGroupTemplateQueryVariables>
      typedQuery={useDashboardGroupTemplateQuery}
      variables={{ groupId: currentGroup.id, id: id as string, locale }}
    >
      {({ group }: DashboardGroupTemplateQuery) => {
        if (!group) {
          return null
        }
        // @TODO add breadcrumb trail to go back to all email templates
        return (
          <>
            <ProgramMenu />
            <div className="w-full">
              <Panel>
                <Panel.Body>
                  <EmailTemplateForm
                    plan={currentGroup.plan}
                    emailContent={group}
                  />
                </Panel.Body>
              </Panel>
            </div>
          </>
        )
      }}
    </TypedQuery>
  )
}

Template.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Template)
export default Template
