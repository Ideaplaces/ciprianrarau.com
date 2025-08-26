import classNames from 'classnames'
import { ButtonLink } from 'components/Button'
import Form from 'components/controls/Form'
import Feature from 'components/Feature'
import Filters, {
  changeFilter,
  ResetFilters,
  showReset,
} from 'components/Filters/Filters'
import Search from 'components/Search/Search'
import { markets, peopleNetworkNames } from 'data/markets'
import { contrastBW } from 'lib/color'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { memberUrl } from 'lib/urls'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

export type MemberListFiltersProps = {
  frontPage?: boolean
  query: any
  setQuery: any
}

const MemberListFilters: VFC<MemberListFiltersProps> = ({
  frontPage,
  query,
  setQuery,
}) => {
  const { formatMessage, locale } = useIntl()
  const { push } = useRouter()
  const { currentGroup, loading } = useCurrentGroup()

  const years = formatMessage({ id: 'term.years' })

  const experiences = [
    { id: '5-99', name: `5+ ${years}` },
    { id: '10-99', name: `10+ ${years}` },
    { id: '15-99', name: `15+ ${years}` },
    { id: '20-99', name: `20+ ${years}` },
  ]

  const showResetFilters = showReset(query)

  const resetFilters = () => {
    setQuery({
      page: undefined,
      peopleNetwork: undefined,
      experience: undefined,
      disciplineId: undefined,
      market: undefined,
      subdisciplineId: undefined,
      query: undefined,
    })
  }

  const initialValues = {
    query: query?.query,
    disciplineId: query?.disciplineId,
    subdisciplineId: query?.subdisciplineId,
    experience: query?.experience,
  }

  const filteredGroup = { ...currentGroup, experiences }

  const memberTypePlural = formatMessage({
    id: 'term.mentors',
  }).toLocaleLowerCase()
  const memberType = formatMessage({ id: 'term.mentor' }).toLocaleLowerCase()

  const browseAllTerm = formatMessage(
    { id: 'button.browseAllTerm' },
    { term: memberTypePlural }
  )
  const browseAll = formatMessage({ id: 'button.browseAll' })
  const filterThe = formatMessage({ id: 'tooltip.filterThe' })
  const term = formatMessage({ id: 'term.a' })
  const searchFor = formatMessage({ id: 'tooltip.searchFor' }, { term: term })

  // some groups don't need a discipline to be selected to show the subdisciplines
  // because subsdiciplines are all the same & independant from the discipline
  const subdisciplines = filteredGroup?.disciplines?.find((x: { id: string }) =>
    currentGroup.hasIndependentSubdisciplines ? x : x.id === query.disciplineId
  )?.subdisciplines

  const redirectSearch = (query: string) => {
    push({
      pathname: `/${locale}${memberUrl(currentGroup)}`,
      query: { query },
    })
  }

  return (
    <Form
      id="memberSearch"
      initialValues={initialValues}
      onSubmit={() => undefined}
      className="pt-8 pb-6 sm:pt-12 sm:pb-2 mb-8"
    >
      {() => (
        <>
          <div
            data-testid="member-search"
            className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-4 sm:space-x-6 sm:space-y-0"
          >
            <div className="flex flex-1 flex-col lg:flex-row w-full items-start">
              <div className="w-auto sm:mr-4 my-1">
                {loading ? (
                  <FieldLoader />
                ) : (
                  <>
                    <p className="font-semibold">
                      {searchFor} {memberType}
                    </p>
                    <p className="text-sm">
                      {formatMessage({ id: 'tooltip.searchBy' })}
                    </p>
                  </>
                )}
              </div>
              <div className="flex-1 w-full items-center my-auto">
                {loading ? (
                  <Skeleton height="3rem" />
                ) : (
                  <Search
                    searchTerm={query?.query || undefined}
                    onSearch={
                      frontPage
                        ? redirectSearch
                        : (value: string) =>
                            setQuery(changeFilter(query, 'query', value))
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-0 flex-col lg:flex-row items-start w-auto justify-end mr-auto">
              <div className="w-auto sm:mr-4 my-1">
                {loading ? (
                  <FieldLoader />
                ) : (
                  <>
                    <p className="font-semibold">{browseAllTerm}</p>
                    <p className="text-sm whitespace-nowrap">
                      {formatMessage({ id: 'tooltip.browseBy' })}
                    </p>
                  </>
                )}
              </div>
              <div className="flex-0 my-auto">
                {loading ? (
                  <Skeleton borderRadius="999px" width="12rem" height="3rem" />
                ) : (
                  <Link href={`/${locale}${memberUrl(currentGroup)}`} passHref>
                    <ButtonLink
                      testId="browse-btn"
                      full
                      variant={
                        contrastBW(currentGroup?.styles?.backgroundColor) ===
                        'white'
                          ? 'invertedPrimary'
                          : 'primary'
                      }
                    >
                      {browseAll}
                    </ButtonLink>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {!frontPage && (
            <div
              data-testid="member-filters"
              className={classNames(
                'container mx-auto flex mt-4',
                'flex-col items-start justify-center',
                'lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-6'
              )}
            >
              <div className="w-auto sm:mr-4 my-1">
                {loading ? (
                  <FieldLoader />
                ) : (
                  <>
                    <p className="font-semibold">
                      {filterThe} {memberTypePlural}
                    </p>
                    <p className="text-sm">
                      {formatMessage({ id: 'tooltip.browseBy' })}
                    </p>
                  </>
                )}
              </div>
              <div className="flex-1 flex flex-wrap lg:w-4/5 text-black justify-start items-center gap-2">
                {loading ? (
                  <div className="flex space-x-2">
                    <Skeleton width={180} height={40} />
                    <Skeleton width={160} height={40} />
                    <Skeleton width={80} height={40} />
                  </div>
                ) : (
                  <>
                    <Filters
                      name="disciplines"
                      options={filteredGroup.disciplines}
                      selection={query?.disciplineId || ''}
                      setSelection={(value) =>
                        setQuery(changeFilter(query, 'disciplineId', value))
                      }
                    />
                    <Feature id="userSubdisciplines">
                      <Filters
                        name="subdiscipline"
                        options={subdisciplines || []}
                        selection={query?.subdisciplineId || undefined}
                        setSelection={(value) =>
                          setQuery(
                            changeFilter(query, 'subdisciplineId', value)
                          )
                        }
                      />
                    </Feature>
                    <Feature id="userExperience">
                      <Filters
                        name="experience"
                        options={experiences}
                        selection={query?.experience || ''}
                        setSelection={(value) =>
                          setQuery(changeFilter(query, 'experience', value))
                        }
                      />
                    </Feature>
                    <Feature id="userMarket">
                      <Filters
                        name="market"
                        options={markets}
                        selection={query?.market || ''}
                        setSelection={(value) =>
                          setQuery(changeFilter(query, 'market', value))
                        }
                      />
                    </Feature>
                    <Feature id="peopleNetwork">
                      <Filters
                        name="peopleNetwork"
                        options={peopleNetworkNames}
                        selection={query?.peopleNetwork || ''}
                        setSelection={(value) =>
                          setQuery(changeFilter(query, 'peopleNetwork', value))
                        }
                      />
                    </Feature>
                    {showResetFilters && (
                      <ResetFilters onClick={resetFilters} />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Form>
  )
}

const FieldLoader = () => (
  <>
    <Skeleton width={100} />
    <Skeleton width={200} />
  </>
)

export default MemberListFilters
