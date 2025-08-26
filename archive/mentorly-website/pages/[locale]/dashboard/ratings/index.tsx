import { gql } from '@apollo/client'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Timeline from 'components/Dashboard/Ratings/Timeline'
import InfoBlock from 'components/display/InfoBlock'
import Panel from 'components/display/Panel'
import Filters, {
  changeFilter,
  FilterOption,
  ResetFilters,
  showReset,
} from 'components/Filters/Filters'
import TypedQuery from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import Pagination from 'components/navigation/Pagination'
import Search from 'components/Search/Search'
import { useCurrentGroup } from 'lib/GroupContext'
import {
  NumberParam,
  ObjectParam,
  StringParam,
  useQueryParam,
  useQueryParams,
} from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import {
  ComparisonTypeEnum,
  DashboardRatingsFieldsFragmentDoc,
  RatingsPageQuery,
  RatingsPageQueryVariables,
  useRatingsPageQuery,
} from 'types/graphql'

gql`
  query ratingsPage(
    $groupId: ID!
    $ratingsPage: Int
    $ratingsLimit: Int
    $sessionRating: Int
    $query: String
    $orderBy: ReviewSorting
    $comparisonType: ComparisonTypeEnum
  ) {
    group: managedGroup(id: $groupId) {
      ...DashboardRatingsFields
    }
  }
  ${DashboardRatingsFieldsFragmentDoc}
`

const filterRatingsOptions = [
  { nameId: 'review.stars.five', id: 5 },
  { nameId: 'review.stars.four', id: 4 },
  { nameId: 'review.stars.three', id: 3 },
  { nameId: 'review.stars.two', id: 2 },
  { nameId: 'review.stars.one', id: 1 },
]

const comparisonTypeOptions = [
  { nameId: 'review.comparisonType.equalTo', id: 'eq' },
  { nameId: 'review.comparisonType.lessThan', id: 'lte' },
  { nameId: 'review.comparisonType.greaterThan', id: 'gte' },
]

const sortOptions: FilterOption[] = [
  {
    nameId: 'review.sortCreatedAtDESC',
    id: { createdAt: 'DESC' },
  },
  {
    nameId: 'review.sortCreatedAtASC',
    id: { createdAt: 'ASC' },
  },
  {
    nameId: 'review.sortRatingASC',
    id: { sessionRating: 'ASC' },
  },
  {
    nameId: 'review.sortRatingDESC',
    id: { sessionRating: 'DESC' },
  },
]

const RatingsPage = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [currentPage, setCurrentPage] = useQueryParam('page', NumberParam)
  const perPage = 10

  const variables = {
    ratingsPage: currentPage,
    ratingsLimit: perPage,
    groupId: currentGroup?.id,
  }

  const ComparisonTypeParam = {
    encode: (enumValue: ComparisonTypeEnum | undefined): string | undefined => {
      return enumValue ? enumValue : undefined
    },
    decode: (
      inputValue: string | (string | null)[] | null | undefined
    ): ComparisonTypeEnum | undefined => {
      return Object.values(ComparisonTypeEnum).includes(
        inputValue as ComparisonTypeEnum
      )
        ? (inputValue as ComparisonTypeEnum)
        : undefined
    },
  }

  const [query, setQuery] = useQueryParams({
    orderBy: ObjectParam,
    sessionRating: NumberParam,
    query: StringParam,
    comparisonType: ComparisonTypeParam,
    page: NumberParam,
  })

  const showResetFilters = showReset(query)

  const resetFilters = () => {
    setQuery({
      sessionRating: undefined,
      query: undefined,
      comparisonType: undefined,
      page: undefined,
    })
  }

  const handleSearch = (value: string) => {
    const newFilters = changeFilter(query, 'query', value)
    setQuery(newFilters)
  }

  return (
    <TypedQuery<RatingsPageQueryVariables>
      typedQuery={useRatingsPageQuery}
      variables={{ ...variables, ...query }}
      skip={!currentGroup}
    >
      {({ group }: RatingsPageQuery) => {
        const ratings = group?.reviews || []
        const stats = {
          numberOfReviews: group?.reviewCount,
          averageSessionRating: group?.averageSessionRating,
          satisfactionRate: `${Math.round(
            ((group?.averageSessionRating || 0) / 5) * 100
          )}%`,
        }

        const updateFilter = (
          filter: string,
          value: number | string | boolean
        ) => {
          const newFilterValues = changeFilter(query, filter, value)
          setQuery((filters: any) => ({ ...filters, ...newFilterValues }))
        }

        return (
          <>
            <Heading>
              <div className="font-black text-xl">
                {formatMessage({ id: 'section.ratings' })}
              </div>
            </Heading>
            <Row cols={3} gap={3} className="grid-cols-2 pb-4">
              {!group ? (
                <Skeleton />
              ) : (
                <>
                  <InfoBlock
                    title={formatMessage({ id: 'review.number' })}
                    value={stats.numberOfReviews || 0}
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'review.average' })}
                    value={`${stats.averageSessionRating} / 5` || 0}
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'review.satisfactionRate' })}
                    value={stats.satisfactionRate}
                  />
                </>
              )}
            </Row>
            <div className="sticky top-[-1.3rem] z-40 bg-white p-4 shadow-bottom border-gray border-b">
              <div className="flex">
                <div className="mb-4 flex-1 flex items-center">
                  <Search
                    searchTerm={query.query || undefined}
                    onSearch={handleSearch}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start flex-col-reverse sm:flex-row gap-2">
                <div className="flex items-center flex-wrap gap-2">
                  <Filters
                    name="selectFilterType"
                    options={comparisonTypeOptions}
                    selection={query.comparisonType}
                    setSelection={(value: string) =>
                      updateFilter('comparisonType', value)
                    }
                  />
                  <Filters
                    name="selectRating"
                    options={filterRatingsOptions}
                    selection={query.sessionRating}
                    setSelection={(value: number) =>
                      updateFilter('sessionRating', value)
                    }
                  />
                  {showResetFilters && (
                    <div>
                      <ResetFilters onClick={resetFilters} />
                    </div>
                  )}
                </div>
                <div className="flex items-center flex-wrap">
                  <Filters
                    name="orderBy"
                    options={sortOptions}
                    selection={query.orderBy}
                    setSelection={(value) =>
                      setQuery(changeFilter(query, 'orderBy', value))
                    }
                  />
                </div>
              </div>
            </div>
            <Panel className="pt-4 h-auto">
              <Panel.Body className="h-full drop-shadow-sm">
                {ratings && <Timeline events={ratings} />}
              </Panel.Body>
              <Panel.Footer className="bg-white">
                <div>&nbsp;</div>
                <Pagination
                  page={currentPage || 1}
                  setPage={setCurrentPage}
                  per={perPage}
                  total={group?.reviewCount}
                />
                <div>&nbsp;</div>
              </Panel.Footer>
            </Panel>
          </>
        )
      }}
    </TypedQuery>
  )
}

RatingsPage.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(RatingsPage)
export default RatingsPage
