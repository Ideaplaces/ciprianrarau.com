type MatchFilteringOptionType = {
  nameId: string
  id: {
    activatedAt?: 'DESC' | 'ASC'
    score?: 'DESC' | 'ASC'
    status?: 'active' | 'inactive' | 'any'
    type?: 'all' | 'mentor' | 'mentee'
  }
}

export const sortOptions: MatchFilteringOptionType[] = [
  {
    nameId: 'form.matching.sortCreatedAtDESC',
    id: { activatedAt: 'DESC' },
  },
  {
    nameId: 'form.matching.sortCreatedAtASC',
    id: { activatedAt: 'ASC' },
  },
  {
    nameId: 'form.matching.sortScoreASC',
    id: { score: 'ASC' },
  },
  {
    nameId: 'form.matching.sortScoreDESC',
    id: { score: 'DESC' },
  },
]

export const statusOptions: MatchFilteringOptionType[] = [
  {
    nameId: 'form.matching.any',
    id: { status: 'any' },
  },
  {
    nameId: 'form.matching.activeOnly',
    id: { status: 'active' },
  },
  {
    nameId: 'form.matching.inactiveOnly',
    id: { status: 'inactive' },
  },
]

export const matchingTypeOptions = [
  {
    nameId: 'term.all',
    id: { type: 'all' },
  },
  {
    nameId: 'form.matching.mentorMatch',
    id: { type: 'mentor' },
  },
  {
    nameId: 'form.matching.menteeMatch',
    id: { type: 'mentee' },
  },
]
