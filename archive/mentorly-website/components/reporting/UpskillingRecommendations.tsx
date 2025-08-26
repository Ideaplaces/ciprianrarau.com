import Panel from 'components/display/Panel'
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
          text="The analysis of mentee goals and skills indicates a strong demand for SQL training, emotional intelligence, teamwork, creativity, and leadership development. Implementing targeted workshops, training programs, and networking events will effectively address these needs, enabling mentees to achieve their short and long-term goals while enhancing critical skills necessary for their career growth."
          translationId="dashboard.insights.upskilling.recommendations.helpText"
        />
        <div className="mb-4">
          <p className="text-gray-700">{summary}</p>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-red-500 inline-block mr-1"></span>
            <div className="relative group">
              <span className="text-sm cursor-help">
                {formatMessage({ id: 'common.priority.high' })}
              </span>
              <div className="absolute z-10 w-60 p-2 text-xs bg-gray-100 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMessage({ id: 'common.priority.high.description' })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-orange-500 inline-block mr-1"></span>
            <div className="relative group">
              <span className="text-sm cursor-help">
                {formatMessage({ id: 'common.priority.medium' })}
              </span>
              <div className="absolute z-10 w-60 p-2 text-xs bg-gray-100 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMessage({ id: 'common.priority.medium.description' })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded bg-blue-500 inline-block mr-1"></span>
            <div className="relative group">
              <span className="text-sm cursor-help">
                {formatMessage({ id: 'common.priority.low' })}
              </span>
              <div className="absolute z-10 w-60 p-2 text-xs bg-gray-100 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMessage({ id: 'common.priority.low.description' })}
              </div>
            </div>
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
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
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
                      {formatMessage({
                        id: `common.priority.${recommendation.priority.toLowerCase()}`,
                      })}
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
              {formatMessage({ id: 'analytics.noUpskillingRecommendations' })}
            </div>
          )}
        </div>
      </Panel.Body>

      {showDebugInfo && (
        <DebugInfoModal
          title={formatMessage({
            id: 'analytics.upskillingRecommendationsDebugInfo',
          })}
          prompt={metadata?.prompt || ''}
          data={metadata?.templateData || {}}
          onClose={() => setShowDebugInfo(false)}
        />
      )}
    </Panel>
  )
}

export default UpskillingRecommendations
