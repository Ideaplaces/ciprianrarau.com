import React from 'react'

interface GoalAnalysisSectionProps {
  title: string
  data: {
    themes: string[]
    insights: string[]
    examples: string[]
  }
  showInsights: boolean
}

const GoalAnalysisSection: React.FC<GoalAnalysisSectionProps> = ({
  title,
  data,
  showInsights,
}) => {
  if (!data) {
    return null
  }

  const { themes = [], insights = [], examples = [] } = data

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <h3 className="text-lg font-medium mb-4 text-gray-900">{title}</h3>

      {themes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Common Themes:
          </h4>
          <ul className="space-y-2">
            {themes.map((theme, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 flex-shrink-0">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-sm">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {examples.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
          <ul className="space-y-2">
            {examples.map((example, index) => (
              <li
                key={index}
                className="p-2 bg-gray-50 rounded text-sm italic border-l-2 border-blue-400"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showInsights && insights.length > 0 && (
        <div className={`${showInsights ? 'animate-fadeIn' : ''}`}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Insights:</h4>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-100 text-yellow-500 mr-2 flex-shrink-0">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default GoalAnalysisSection
