import Panel from 'components/display/Panel'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import DebugInfoModal from './DebugInfoModal'
import KnowledgeGapVisualization from './KnowledgeGapVisualization'
import SectionHelpText from './SectionHelpText'

interface KnowledgeGap {
  skill: string
  gapLevel: number
  description: string
  recommendations: string[]
}

interface KnowledgeGapItem {
  name: string
  type: string
  menteeCount: number
  mentorCount: number
  gap: number
}

interface KnowledgeGapAnalysisProps {
  analysisData: {
    gaps: KnowledgeGap[]
    summary: string
  }
  metadata: {
    prompt: string
    templateData: any
  }
  rawData?: {
    knowledgeGaps: KnowledgeGapItem[]
    mentorSkills: any
    menteeSkills: any
  }
}

const KnowledgeGapAnalysis: React.FC<KnowledgeGapAnalysisProps> = ({
  analysisData,
  metadata,
  rawData: _rawData,
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean
  }>({})
  // locale is used indirectly through Apollo client context for translations
  const { formatMessage, locale: _locale } = useIntl()

  if (!analysisData) {
    return null
  }

  const { gaps, summary } = analysisData

  // Sort gaps by gapLevel in ascending order (lowest/largest gaps first)
  const sortedGaps = [...gaps].sort((a, b) => a.gapLevel - b.gapLevel)

  // Function to determine badge color based on gap level
  // Now using inverse scale where 0 = largest gap, 10 = full coverage
  const getBadgeColor = (gapLevel: number): string => {
    if (gapLevel <= 2) return 'bg-red-500'
    if (gapLevel <= 4) return 'bg-orange-500'
    if (gapLevel <= 6) return 'bg-yellow-500'
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
    <>
      {/* Show the visualization using raw data if available, otherwise use the gaps data */}
      {_rawData?.knowledgeGaps && _rawData.knowledgeGaps.length > 0 ? (
        <div className="mb-6">
          <KnowledgeGapVisualization knowledgeGaps={_rawData.knowledgeGaps} />
        </div>
      ) : gaps && gaps.length > 0 ? (
        <div className="mb-6">
          <KnowledgeGapVisualization gaps={gaps} />
        </div>
      ) : null}

      <Panel>
        <Panel.Header
          heading={formatMessage({ id: 'analytics.knowledgeGap' })}
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
            text="Assessment of skill alignment across your program. It spotlights the disconnect between mentee needs and mentor capabilities, and recommendations on how to close the gap with strategic action to drive better outcomes."
            translationId="dashboard.insights.knowledgeGap.helpText"
          />
          <div className="mb-4">
            <p className="text-gray-700">{summary}</p>
          </div>

          <div className="mb-6">
            {sortedGaps && sortedGaps.length > 0 ? (
              sortedGaps.map((gap, index) => (
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
                      <h3 className="text-lg font-medium">{gap.skill}</h3>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs text-white rounded ${getBadgeColor(
                        gap.gapLevel
                      )}`}
                    >
                      {formatMessage(
                        { id: 'analytics.gap' },
                        { level: gap.gapLevel.toFixed(1) }
                      )}
                    </span>
                  </div>
                  {expandedItems[index] && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-700 mb-3">
                        {gap.description}
                      </p>
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          {formatMessage({ id: 'analytics.recommendations' })}:
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          {gap.recommendations.map(
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
                {formatMessage({ id: 'analytics.noGaps' })}
              </div>
            )}
          </div>
        </Panel.Body>

        {showDebugInfo && (
          <DebugInfoModal
            title={formatMessage({ id: 'analytics.knowledgeGapDebugInfo' })}
            prompt={metadata?.prompt || ''}
            data={metadata?.templateData || {}}
            onClose={() => setShowDebugInfo(false)}
          />
        )}
      </Panel>
    </>
  )
}

export default KnowledgeGapAnalysis
