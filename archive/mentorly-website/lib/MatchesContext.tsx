import { createContext, FC, ReactNode, useContext } from 'react'
import { Maybe, MentorMatchesFieldsFragment } from 'types/graphql'

const MatchesContext = createContext({})

type MatchesProviderProps = {
  data: {
    handleRemove: (matches: string | MentorMatchesFieldsFragment) => void
    toRemoveIds: string[]
    members: Maybe<MentorMatchesFieldsFragment[]>
    expandedRows: number[]
    headers: any[]
    segment?: Maybe<string>
  }
  children: ReactNode
}

export const MatchesProvider: FC<MatchesProviderProps> = ({
  data,
  children,
}) => {
  return (
    <MatchesContext.Provider value={data}>{children}</MatchesContext.Provider>
  )
}

export const useMatches = () => {
  return useContext(MatchesContext) as MatchesProviderProps['data']
}

export default MatchesContext
