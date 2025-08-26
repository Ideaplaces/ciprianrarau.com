import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { ProgramMenu } from 'components/Dashboard/Menu'
import DesignForm from 'components/Dashboard/Program/DesignForm'
import GroupAssets from 'components/Dashboard/Program/GroupAssets'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  DesignFormFieldsFragmentDoc,
  GroupDesignQuery,
  GroupDesignQueryVariables,
  GroupFileFieldsFragmentDoc,
  useGroupDesignQuery,
} from 'types/graphql'

gql`
  query groupDesign($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      whiteLabel
      files {
        ...GroupFileFields
      }
      ...DesignFormFields
    }
  }
  ${GroupFileFieldsFragmentDoc}
  ${DesignFormFieldsFragmentDoc}
`

const Program = () => {
  const { locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  return (
    <div className="max-w-4xl">
      <TypedQuery<GroupDesignQueryVariables>
        typedQuery={useGroupDesignQuery}
        variables={{ groupId: currentGroup.id, locale }}
        skip={!currentGroup?.id}
        passLoading
      >
        {({ refetch, group, loading }: TypedQueryReturn & GroupDesignQuery) => {
          if (!group) {
            return null
          }
          return (
            <>
              <ProgramMenu />
              <DesignForm group={group} loading={loading} />
              <GroupAssets group={group} refetch={refetch} />
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
