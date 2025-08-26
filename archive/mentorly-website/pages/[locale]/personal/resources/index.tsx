import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import Alert from 'components/feedback/Alert'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Resource from 'components/Resources/resource'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { useIntl } from 'react-intl'
import {
  ResourcesPageQuery,
  ResourcesPageQueryVariables,
  useResourcesPageQuery,
} from 'types/graphql'

gql`
  query resourcesPage($groupId: ID!) {
    group(id: $groupId) {
      id
      name
      fileCategories {
        id
        name
        files {
          customUrl
          description
          displayHeight
          displayWidth
          isDownloadable
          fileUrl
          height
          id
          key
          mimeType
          position
          title
          type
          url
          width
        }
      }
    }
  }
`

const Resources = () => {
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  if (!currentUser) return null

  return (
    <TypedQuery<ResourcesPageQueryVariables>
      typedQuery={useResourcesPageQuery}
      variables={{ groupId: currentGroup.id }}
      skip={!currentGroup}
    >
      {({ group }: TypedQueryReturn & ResourcesPageQuery) => {
        const resourceFileCategories = group?.fileCategories

        const hasAtLeastOneFile = resourceFileCategories?.some((category) =>
          category.files.some((file) => file.title !== null)
        )

        return (
          <>
            <h1 className="mb-3 text-2xl font-black">
              {formatMessage({ id: 'header.resources' })}
            </h1>
            <p>
              A collection of tools, guides, and information designed to enhance
              your experience and empower your journey.
            </p>
            {hasAtLeastOneFile ? (
              <>
                {resourceFileCategories?.map(
                  (resourceFileCategory, indexFileCategory) => (
                    <div key={indexFileCategory}>
                      <h2 className="my-3 text-xl font-black">
                        {resourceFileCategory.name == 'uncategorized'
                          ? formatMessage({ id: 'text.uncategorized' })
                          : resourceFileCategory.name}
                      </h2>
                      <div className="max-w-xl bg-white rounded">
                        <ul className="flex flex-col divide-y">
                          {resourceFileCategory.files?.map(
                            (resourceFile, indexResourceFile) => (
                              <Resource
                                key={indexResourceFile}
                                resource={resourceFile}
                              />
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <p className="my-3 text-lg font-black">
                  <Alert
                    title={formatMessage({ id: 'text.noResourcesTitle' })}
                    description={formatMessage({ id: 'text.noResources' })}
                    className="w-10/12 my-1/12 mx-auto"
                    showIcon
                  />
                </p>
              </>
            )}
          </>
        )
      }}
    </TypedQuery>
  )
}

Resources.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Resources)
export default Resources
