import { gql } from '@apollo/client'

export const KNOWLEDGE_GAP_ANALYSIS_QUERY = gql`
  query KnowledgeGapAnalysis($groupId: ID!, $locale: String) {
    knowledgeGapAnalysis(groupId: $groupId, locale: $locale) {
      gaps {
        skill
        gapLevel
        description
        recommendations
      }
      summary
      metadata {
        prompt
        templateData
      }
      rawData {
        knowledgeGaps {
          name
          type
          menteeCount
          mentorCount
          gap
          gapLevel
        }
        mentorSkills {
          hardSkills {
            name
            count
          }
          softSkills {
            name
            count
          }
        }
        menteeSkills {
          hardSkills {
            name
            count
          }
          softSkills {
            name
            count
          }
        }
      }
    }
  }
`

export default KNOWLEDGE_GAP_ANALYSIS_QUERY
