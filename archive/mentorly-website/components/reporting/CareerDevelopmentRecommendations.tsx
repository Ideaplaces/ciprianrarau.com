import Panel from 'components/display/Panel'
import Tooltip from 'components/display/Tooltip'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import DebugInfoModal from './DebugInfoModal'
import SectionHelpText from './SectionHelpText'

interface UpskillingRecommendation {
  title: string
  priority: string
  description: string
  implementation: string
  expectedOutcome: string
  howToMeasure: string
}

interface UpskillingRecommendationsAnalysis {
  recommendations: UpskillingRecommendation[]
  summary: string
}

interface UpskillingRecommendationsProps {
  analysisData: UpskillingRecommendationsAnalysis
  metadata: {
    prompt: string
    templateData: any
  }
}

const UpskillingRecommendations: React.FC<UpskillingRecommendationsProps> = ({
  analysisData,
  metadata,
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean
  }>({})
  const { formatMessage } = useIntl()

  if (!analysisData) {
    return null
  }

  const { recommendations, summary } = analysisData

  // Function to determine badge color based on priority
  const getBadgeColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-orange-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <Panel>
      <Panel.Header
        heading={formatMessage({ id: 'term.upskilling.recommendations' })}
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
          text="Key strategies to help mentees strengthen their skills, improve their performance, and accelerate their career growth."
          translationId="dashboard.insights.upskilling.recommendations.helpText"
        />
        <div className="mb-4">
          <p className="text-gray-700">{summary}</p>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-red-500 inline-block mr-1"></span>
            <Tooltip text="Critical skills with significant impact on career growth and organizational success; addresses immediate needs or urgent skill gaps">
              <span className="text-sm">High</span>
            </Tooltip>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-orange-500 inline-block mr-1"></span>
            <Tooltip text="Important skills that enhance performance and career development; should be addressed in the medium term">
              <span className="text-sm">Medium</span>
            </Tooltip>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-blue-500 inline-block mr-1"></span>
            <Tooltip text="Beneficial skills that add value but are less urgent; can be developed over a longer timeframe">
              <span className="text-sm">Low</span>
            </Tooltip>
          </div>
        </div>

        <div className="mb-6">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map(
              (recommendation: UpskillingRecommendation, index: number) => (
                <div
                  key={index}
                  className="mb-5 border rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-center">
                      {expandedItems[index] ? (
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                      <h3 className="text-lg font-medium">
                        {recommendation.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs text-white rounded ${getBadgeColor(
                        recommendation.priority
                      )}`}
                    >
                      {recommendation.priority}
                    </span>
                  </div>
                  {expandedItems[index] && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-700 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">
                          {formatMessage({
                            id: 'term.upskilling.implementation',
                          })}
                          :
                        </h4>
                        <p className="text-sm text-gray-700">
                          {recommendation.implementation}
                        </p>
                      </div>
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">
                          {formatMessage({
                            id: 'term.upskilling.expectedOutcome',
                          })}
                          :
                        </h4>
                        <p className="text-sm text-gray-700">
                          {recommendation.expectedOutcome}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          {formatMessage({
                            id: 'term.upskilling.howToMeasure',
                          })}
                          :
                        </h4>
                        <p className="text-sm text-gray-700">
                          {recommendation.howToMeasure}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upskilling recommendations available.
            </div>
          )}
        </div>
      </Panel.Body>

      {showDebugInfo && (
        <DebugInfoModal
          title="Upskilling Recommendations Debug Info"
          prompt={metadata?.prompt || ''}
          data={metadata?.templateData || {}}
          onClose={() => setShowDebugInfo(false)}
        />
      )}
    </Panel>
  )
}

export default UpskillingRecommendations
