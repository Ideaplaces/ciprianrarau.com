import getRow from 'components/Matching/Row'
import { format } from 'date-fns'
import { isString, maxBy, minBy, pull, round } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import {
  ManagedUser,
  Maybe,
  MemberMatchingFieldsFragment,
  MentorMatch,
  MentorMatchesMatchFieldsFragment,
} from 'types/graphql'

export const formatMatchingTypeVariable = (
  selection?: Maybe<Record<string, string | undefined>>
) => {
  if (selection?.type === 'mentor') return 'mentor_matches'
  if (selection?.type === 'mentee') return 'mentee_matches'
  return null
}

export const formatScore = (n?: number) => {
  if (n === 0) return '0%'
  if (!n) return '-'
  return `${round(n)}%`
}

export const formatScoreRange = (
  matches: Pick<MentorMatch, 'scorePercentage'>[]
) => {
  const minScore = minBy(matches, 'scorePercentage')?.scorePercentage
  const maxScore = maxBy(matches, 'scorePercentage')?.scorePercentage
  if (minScore === maxScore) return formatScore(minScore)
  return `${formatScore(minScore)} - ${formatScore(maxScore)}`
}

export const compatibilityScore = (
  allMatches: Pick<MentorMatch, 'scorePercentage'>[],
  match?: Maybe<Pick<MentorMatch, 'scorePercentage'>>,
  expanded?: boolean
) => {
  if (expanded) return formatScore(match?.scorePercentage)
  if (allMatches.length === 1) return formatScore(allMatches[0].scorePercentage)
  if (allMatches.length > 1) return formatScoreRange(allMatches)
  return null
}

const formatDate = (date: Date) => {
  if (!date) return
  return format(new Date(date), 'MM/d/yyyy')
}

type LastActivatedMatchType = Pick<
  MentorMatch,
  'activatedAt' | 'updatedAt' | 'deactivatedAt'
>

const latestActivatedMatch = (matches: LastActivatedMatchType[]) => {
  const dates = matches
    .map((m) => m.activatedAt)
    .filter(Boolean)
    .sort()
    .reverse()

  const date = formatDate(dates[0])

  return date ? [date] : []
}

const activationDates = (match?: Maybe<LastActivatedMatchType>) => {
  if (!match) {
    return []
  }

  const result = []

  const activatedAt = formatDate(match.activatedAt)
  const deactivatedAt = formatDate(match.deactivatedAt)

  if (activatedAt) {
    result.push(activatedAt)
  }

  if (deactivatedAt) {
    result.push(deactivatedAt)
  }

  return result
}

export const lastUpdated = (
  allMatches: LastActivatedMatchType[],
  match?: Maybe<LastActivatedMatchType>,
  expanded?: boolean
): string[] => {
  if (expanded) return activationDates(match)
  if (allMatches.length === 1) return activationDates(allMatches[0])
  if (allMatches.length > 1) return latestActivatedMatch(allMatches)
  return []
}

export const getOtherUser = (
  member: Pick<ManagedUser, 'id'> | string,
  match: MentorMatchesMatchFieldsFragment
) => {
  if (!match) return null

  const memberId = isString(member) ? member : member.id

  return [match.mentee, match.mentor].find((m) => m?.id !== memberId)
}

export type UserMatchDataType = Partial<ManagedUser> & {
  matchId: string
  score: number
  active: boolean
  manual: boolean
}

export const userMatchData = (
  member: ManagedUser | string,
  match: MentorMatch
) => {
  return {
    ...getOtherUser(member, match),
    matchId: match.id,
    score: match.scorePercentage,
    active: match.active,
    manual: match.manual,
  } as UserMatchDataType
}

export const onlyExistingUserMatches = (
  members: MemberMatchingFieldsFragment[]
) => {
  if (!members) return null
  return members.map((member) => {
    return {
      ...member,
      allMatches: member.allMatches.filter(
        (match) => match.mentee && match.mentor
      ),
    }
  })
}

export type CurrentRowType = {
  row: (JSX.Element | undefined)[]
  isParent: boolean
}

export const getCurrentRows = (
  members: Maybe<MemberMatchingFieldsFragment[]>,
  expandedRows: any,
  headers: any
) => {
  const rowsClone: CurrentRowType[] = []

  if (!members) return null

  members.forEach((m, i) => {
    const expanded = expandedRows.includes(i) && m.allMatches.length > 0
    if (expanded) {
      for (let index = 0; index <= m.allMatches.length - 1; index++) {
        rowsClone.push({
          row: getRow(m, headers, m.allMatches[index], index, expanded),
          isParent: index === 0,
        })
      }
      // Push an extra array to render the extra "Add match" row
      rowsClone.push({
        row: getRow(m, headers, null, m.allMatches.length, expanded),
        isParent: false,
      })
    } else {
      rowsClone.push({
        row: getRow(m, headers),
        isParent: true,
      })
    }
  })

  return rowsClone
}

export const handleRowClick = (
  index: number,
  rows: Maybe<CurrentRowType[]>,
  expandedRows: number[],
  setExpandedRows: Dispatch<SetStateAction<number[]>>
) => {
  if (!rows || !rows[index].isParent) return

  let x = 0
  let realIndex = 0

  while (x < index) {
    if (rows[x].isParent) {
      realIndex++
    }
    x++
  }

  if (expandedRows.includes(realIndex)) {
    setExpandedRows([...pull(expandedRows, realIndex)])
  } else {
    setExpandedRows([...expandedRows, realIndex])
  }
}
