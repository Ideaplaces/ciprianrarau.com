import Pill from 'components/display/Pill'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { isEmpty, map, omit, omitBy } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type FilterPillsProps = {
  filters: (string | boolean)[]
  readOnly?: boolean
}
const FilterPills: FC<FilterPillsProps> = ({ filters, readOnly }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { push, pathname } = useRouter()

  const { disciplines, tags, cohorts } = currentGroup

  // @TODO: filterPills may not always be used in this context
  const removeFilter = (filter: string) => {
    filter === 'all'
      ? push({
          pathname,
          query: { locale, id: 'new' },
        })
      : push({
          pathname,
          query: {
            locale,
            id: 'new',
            groupId: currentGroup.id,
            ...omit(filters, filter),
          },
        })
  }

  const activeFilters = omitBy(filters, (v) => !v)
  if (isEmpty(activeFilters)) {
    return (
      <Pill
        onRemove={readOnly ? undefined : () => removeFilter('all')}
        color="gray"
        className="border-black"
      >
        {formatMessage({ id: 'term.allMembers' })}
      </Pill>
    )
  }

  return (
    <>
      {map(activeFilters, (v, k) => {
        const value =
          k === 'tag'
            ? tags.find((t) => t.key === v)?.name
            : k === 'disciplineId'
            ? disciplines.find((d) => d.id === v)?.name
            : k === 'cohort'
            ? cohorts.find((d) => d.id === v)?.name
            : k === 'archived'
            ? String(v)
            : v

        return (
          <Pill
            key={k}
            onRemove={readOnly ? undefined : () => removeFilter(k)}
            color="gray"
            className="border-black mt-2"
          >
            {k.split('Id')[0]}: {value}
          </Pill>
        )
      })}
    </>
  )
}

export default FilterPills
