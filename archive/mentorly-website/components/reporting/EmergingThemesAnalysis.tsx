import Panel from 'components/display/Panel'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import DebugInfoModal from './DebugInfoModal'
import SectionHelpText from './SectionHelpText'

interface Theme {
  title: string
  importance: number
  description: string
  recommendations: string[]
}

interface EmergingThemesAnalysisData {
  themes: Theme[]
  summary: string
}

interface EmergingThemesAnalysisProps {
  analysisData: EmergingThemesAnalysisData
  metadata: {
    prompt: string
    templateData: any
  }
}

const EmergingThemesAnalysis: React.FC<EmergingThemesAnalysisProps> = ({
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

  const { themes, summary } = analysisData

  // Sort themes by importance in descending order
  const sortedThemes = [...themes].sort((a, b) => b.importance - a.importance)

  // Function to determine badge color based on importance
  const getBadgeColor = (importance: number): string => {
    if (importance >= 7) return 'bg-red-500'
    if (importance >= 5) return 'bg-orange-500'
    if (importance >= 3) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  // Toggle expand/collapse for a specific item
  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <Panel>
      <Panel.Header
        heading={formatMessage({ id: 'analytics.emergingThemes' })}
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
          text="Identifies recurring patterns and key topics from mentorship conversations and feedback. These insights reveal what matters most to your participants and provide actionable recommendations to enhance program effectiveness."
          translationId="dashboard.insights.emergingThemes.helpText"
        />
        <div className="mb-4">
          <p className="text-gray-700">{summary}</p>
        </div>

        <div className="mb-6">
          {sortedThemes && sortedThemes.length > 0 ? (
            sortedThemes.map((theme, index) => (
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
                    <h3 className="text-lg font-medium">{theme.title}</h3>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs text-white rounded ${getBadgeColor(
                      theme.importance
                    )}`}
                  >
                    {formatMessage(
                      { id: 'analytics.importance' },
                      { level: theme.importance.toFixed(1) }
                    )}
                  </span>
                </div>
                {expandedItems[index] && (
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700 mb-3">
                      {theme.description}
                    </p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {formatMessage({ id: 'analytics.recommendations' })}:
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {theme.recommendations.map(
                          (recommendation, recIndex) => (
                            <li key={recIndex} className="mb-1">
                              {recommendation}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {formatMessage({ id: 'analytics.noThemes' })}
            </div>
          )}
        </div>
      </Panel.Body>

      {showDebugInfo && (
        <DebugInfoModal
          title={formatMessage({ id: 'analytics.emergingThemesDebugInfo' })}
          prompt={metadata?.prompt || ''}
          data={metadata?.templateData || {}}
          onClose={() => setShowDebugInfo(false)}
        />
      )}
    </Panel>
  )
}

export default EmergingThemesAnalysis
