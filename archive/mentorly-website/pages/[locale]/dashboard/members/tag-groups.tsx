import DashboardLayout from 'components/Dashboard/Layout'
import ExpandCollapse from 'components/Dashboard/Members/ExpandCollapseTagGroup'
import TagGroup from 'components/Dashboard/Members/TagGroup'
import SearchAndAdd from 'components/Dashboard/Members/TagSearchAdd'
import { MembersMenu } from 'components/Dashboard/Menu'
import Spinner from 'components/feedback/Spinner'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import {
  DashboardGroupTagsQuery,
  DashboardGroupTagsQueryVariables,
  Tag,
  useDashboardGroupTagsQuery,
} from 'types/graphql'

import styles from './tag-groups.module.scss'

gql`
  fragment TagFields on Tag {
    id
    key
    nameEn: name(locale: "en")
    nameFr: name(locale: "fr")
    isFiltering
    isPublic
  }
  mutation updateTag($id: ID!, $attributes: TagAttributes!) {
    updateTag(id: $id, attributes: $attributes) {
      tag {
        ...TagFields
      }
      errors
      errorDetails
    }
  }
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id) {
      tag {
        ...TagFields
      }
      errors
      errorDetails
    }
  }
  mutation createTag($groupId: ID!, $attributes: TagAttributes!) {
    createTag(groupId: $groupId, attributes: $attributes) {
      tag {
        ...TagFields
      }
      errors
      errorDetails
    }
  }
  query dashboardGroupTags($groupId: ID!, $query: String, $locale: String) {
    group: managedGroup(id: $groupId) {
      id
      slug
      tags(query: $query) {
        name: name(locale: $locale)
        ...TagFields
      }
    }
  }
`

const TagGroups = () => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [expandAll, setExpandAll] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [query, setQuery] = useQueryParam('query', StringParam)

  const singleLocale =
    currentGroup.languages.length === 1 && currentGroup.languages[0].code

  return (
    <TypedQuery<DashboardGroupTagsQueryVariables>
      typedQuery={useDashboardGroupTagsQuery}
      variables={{
        groupId: currentGroup?.id,
        query,
        locale: singleLocale || locale,
      }}
      skip={!currentGroup}
      passLoading
    >
      {({
        refetch,
        loading,
        group,
      }: TypedQueryReturn & DashboardGroupTagsQuery) => (
        <div className="flex flex-col">
          <MembersMenu />
          <div className="flex flex-col px-4 pb-4 bg-white">
            <div className="sticky bg-white pt-6 -top-6 z-20">
              <SearchAndAdd
                query={query || undefined}
                refetch={refetch}
                setQuery={setQuery}
                showModal={showModal}
                setShowModal={setShowModal}
              />
              {!loading && group?.tags?.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center">
                  {query ? (
                    formatMessage({ id: 'faq.noResults' })
                  ) : (
                    <>
                      {formatMessage({ id: 'tagging.noTags' })}
                      <br />
                      <button
                        className="border-0 text-highlightColor"
                        onClick={() => setShowModal(true)}
                      >
                        <span>
                          {formatMessage({ id: 'tagging.createTag' })}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 justify-center">
                    <ExpandCollapse
                      expand={true}
                      setExpandAll={setExpandAll}
                      expandAll={expandAll}
                    />
                    <ExpandCollapse
                      expand={false}
                      setExpandAll={setExpandAll}
                      expandAll={expandAll}
                    />
                  </div>
                  <TagGroupLegend />
                </div>
              )}
            </div>
            <div className="h-full">
              <div className={styles.mosaic}>
                {loading ? (
                  <Spinner />
                ) : (
                  group?.tags?.map((tag: Tag) => (
                    <TagGroup
                      key={tag.id}
                      tag={tag}
                      expandAll={expandAll}
                      pills={tagGroupLegendItems}
                      refetch={refetch}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </TypedQuery>
  )
}

const tagGroupLegendItems = [
  { id: 'public', color: 'accentColor' },
  { id: 'filtering', color: 'backgroundColor' },
]

const TagGroupLegend = () => {
  const { formatMessage } = useIntl()

  const LegendItem = ({ item }: { item: any }) => (
    <div className="ml-4 flex items-center">
      <span className="mr-2 text-bold">
        {formatMessage({ id: `term.tags.${item.id}` })}
      </span>
      <div className={`h-5 w-5 bg-${item.color} rounded-full`}></div>
    </div>
  )

  return (
    <div className="flex items-center">
      {tagGroupLegendItems.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </div>
  )
}

TagGroups.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(TagGroups)
export default TagGroups
