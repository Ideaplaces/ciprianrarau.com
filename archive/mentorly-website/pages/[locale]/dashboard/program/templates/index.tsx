import DashboardLayout from 'components/Dashboard/Layout'
import { ProgramMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import TypedQuery from 'components/Graphql/TypedQuery'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { Edit, Eye } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  DashboardGroupTemplatesQuery,
  DashboardGroupTemplatesQueryVariables,
  useDashboardGroupTemplatesQuery,
} from 'types/graphql'

gql`
  query dashboardGroupTemplates($groupId: ID!, $locale: String) {
    group: managedGroup(id: $groupId) {
      id
      emailContents {
        id
        action
        audience
        key
        subject(locale: $locale)
      }
    }
  }
`

const Templates = () => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()

  const enterprise = currentGroup.plan?.name === 'Enterprise'

  return (
    <div className="max-w-4xl">
      <TypedQuery<DashboardGroupTemplatesQueryVariables>
        typedQuery={useDashboardGroupTemplatesQuery}
        variables={{ groupId: currentGroup.id as string, locale: locale }}
        skip={!currentGroup}
      >
        {({ group }: DashboardGroupTemplatesQuery) => (
          <>
            <ProgramMenu />
            <div>
              <Panel>
                <Panel.Body>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="font-black text-left">
                          {formatMessage({ id: `header.audience` })}
                        </th>
                        <th className="font-black text-left">
                          {formatMessage({ id: `header.key` })}
                        </th>
                        <th className="font-black text-left">
                          {formatMessage({ id: `header.subject` })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="pb-10">
                      {group?.emailContents?.map((template) => (
                        <Link
                          href={`/${locale}/dashboard/program/templates/${template.id}`}
                          key={template.id}
                          passHref
                        >
                          <tr className="cursor-pointer hover:bg-lightGray">
                            <td className="py-2">
                              {formatMessage({
                                id: `term.${template.audience}`,
                              })}
                            </td>
                            <td className="py-2">{template.action}</td>
                            <td className="py-2">
                              <div className="flex">
                                <div className="flex-1" key={template.id}>
                                  {template.subject}
                                </div>
                                <div>{enterprise ? <Edit /> : <Eye />}</div>
                              </div>
                            </td>
                          </tr>
                        </Link>
                      ))}
                    </tbody>
                  </table>
                </Panel.Body>
              </Panel>
            </div>
          </>
        )}
      </TypedQuery>
    </div>
  )
}

Templates.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Templates)
export default Templates
