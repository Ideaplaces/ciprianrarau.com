import Panel from 'components/display/Panel'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import DebugInfoModal from './DebugInfoModal'
import GoalAnalysisSection from './GoalAnalysisSection'
import SectionHelpText from './SectionHelpText'

interface GoalData {
  themes: string[]
  insights: string[]
  examples: string[]
}

interface UserGoalsAnalysisProps {
  analysisData: {
    shortTerm: GoalData
    longTerm: GoalData
  }
  metadata: {
    prompt: string
    templateData: any
  }
}

const UserGoalsAnalysis: React.FC<UserGoalsAnalysisProps> = ({
  analysisData,
  metadata,
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const { formatMessage } = useIntl()

  if (!analysisData) {
    return null
  }

  const { shortTerm, longTerm } = analysisData

  return (
    <Panel>
      <Panel.Header
        heading={formatMessage({ id: 'analytics.goalsAnalysis' })}
        action={
          <button
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
            onClick={() => setShowDebugInfo(true)}
          >
            <span className="flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {formatMessage({ id: 'common.viewPromptAndData' })}
            </span>
          </button>
        }
      />
      <Panel.Body>
        <SectionHelpText
          text="Top goals mentees are striving to achieve through mentorship. Leverage these insights to empower mentees and guide them toward their fullest potential."
          translationId="dashboard.insights.goalsAnalysis.helpText"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoalAnalysisSection
            title={formatMessage({ id: 'analytics.shortTermGoalsAnalysis' })}
            data={shortTerm}
            showInsights={showInsights}
          />
          <GoalAnalysisSection
            title={formatMessage({ id: 'analytics.longTermGoalsAnalysis' })}
            data={longTerm}
            showInsights={showInsights}
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors"
          >
            {showInsights
              ? formatMessage({ id: 'common.hideInsights' })
              : formatMessage({ id: 'common.learnMore' })}
          </button>
        </div>
      </Panel.Body>

      {showDebugInfo && (
        <DebugInfoModal
          title={formatMessage({ id: 'analytics.goalsAnalysisDebugInfo' })}
          prompt={metadata?.prompt || ''}
          data={metadata?.templateData || {}}
          onClose={() => setShowDebugInfo(false)}
        />
      )}
    </Panel>
  )
}

export default UserGoalsAnalysis
