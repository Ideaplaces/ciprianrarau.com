import { ButtonLink } from 'components/Button'
import MemberCard from 'components/display/MemberCard'
import Spinner from 'components/feedback/Spinner'
import { changeFilter } from 'components/Filters/Filters'
import Pagination from 'components/navigation/Pagination'
import { contrastBW } from 'lib/color'
import { useCurrentGroup } from 'lib/GroupContext'
import { memberUrl } from 'lib/urls'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { MemberCardFieldsFragment } from 'types/graphql'

type MemberListProps = {
  frontPage?: boolean
  hideBadge?: boolean
  query: any
  setQuery: any
  loading?: boolean
  mentors: MemberCardFieldsFragment[]
  limit: number
  mentorCount: number
  isFiltering?: boolean
}

const MemberList: VFC<MemberListProps> = ({
  loading,
  mentors,
  isFiltering,
  hideBadge,
  frontPage,
  mentorCount,
  limit,
  query,
  setQuery,
}) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  if (!loading && mentors.length < 1 && isFiltering) {
    return (
      <div className="w-full text-center py-16">
        <div className="font-bold text-lg">
          {formatMessage({ id: 'faq.noResults' })}
        </div>
        <p className="py-4 opacity-75">
          {formatMessage({ id: 'filters.noResult' })}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center py-16">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div
        data-testid="member-list"
        className="container mx-auto justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-8 pt-6"
      >
        {mentors?.map((mentor: any) => (
          <MemberCard
            key={mentor.id}
            user={mentor}
            hideBadge={hideBadge}
            loading={loading}
          />
        ))}
      </div>
      {frontPage && currentGroup?.memberCount > 0 && <BrowseAll />}
      {!frontPage && (
        <div className="text-center pb-6 px-6 w-full">
          <Pagination
            page={query?.page || 1}
            per={limit}
            setPage={(value: number) =>
              setQuery(changeFilter(query, 'page', value))
            }
            total={mentorCount}
          />
        </div>
      )}
    </>
  )
}

const BrowseAll: VFC = () => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()

  const browseAllTerm = formatMessage(
    { id: 'button.browseAllTerm' },
    {
      term: formatMessage({
        id: 'term.mentors',
      }).toLocaleLowerCase(),
    }
  )

  return (
    <div className="text-center pb-12">
      <Link href={`/${locale}${memberUrl(currentGroup)}`} passHref>
        <ButtonLink
          variant={
            contrastBW(currentGroup?.styles?.backgroundColor) === 'white'
              ? 'invertedPrimary'
              : 'primary'
          }
        >
          {browseAllTerm}
        </ButtonLink>
      </Link>
    </div>
  )
}

export default MemberList
