import { gql } from '@apollo/client'

export const CAREER_DEVELOPMENT_RECOMMENDATIONS_QUERY = gql`
  query CareerDevelopmentRecommendations($groupId: ID!, $locale: String) {
    careerDevelopmentRecommendations(groupId: $groupId, locale: $locale) {
      recommendations {
        title
        priority
        description
        implementation
        expectedOutcome
        howToMeasure
      }
      summary
      metadata {
        prompt
        templateData
      }
    }
  }
`

export default CAREER_DEVELOPMENT_RECOMMENDATIONS_QUERY
