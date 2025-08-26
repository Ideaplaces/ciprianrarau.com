import { gql } from '@apollo/client'

export const EMERGING_THEMES_ANALYSIS_QUERY = gql`
  query EmergingThemesAnalysis($groupId: ID!, $locale: String) {
    emergingThemesAnalysis(groupId: $groupId, locale: $locale) {
      themes {
        title
        importance
        description
        recommendations
      }
      summary
      metadata {
        prompt
        templateData
      }
    }
  }
`

export default EMERGING_THEMES_ANALYSIS_QUERY
