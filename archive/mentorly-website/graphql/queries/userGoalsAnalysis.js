import { gql } from '@apollo/client'

export const USER_GOALS_ANALYSIS_QUERY = gql`
  query UserGoalsAnalysis($groupId: ID!, $locale: String) {
    userGoalsAnalysis(groupId: $groupId, locale: $locale) {
      shortTerm {
        themes
        insights
        examples
      }
      longTerm {
        themes
        insights
        examples
      }
      metadata {
        prompt
        templateData
      }
    }
  }
`
