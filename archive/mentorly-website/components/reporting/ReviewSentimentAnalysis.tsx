import { gql, useQuery } from '@apollo/client'
import { ResponsivePie } from '@nivo/pie'
import Panel from 'components/display/Panel'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

import SectionHelpText from './SectionHelpText'

// GraphQL query to fetch review sentiment analysis
export const REVIEW_SENTIMENT_ANALYSIS_QUERY = gql`
  query ReviewSentimentAnalysis($groupId: ID!, $locale: String) {
    reviewSentimentAnalysis(groupId: $groupId, locale: $locale) {
      sentimentSummary
      positiveThemes {
        theme
        description
        example {
          reviewerName
          reviewText
        }
      }
      neutralThemes {
        theme
        description
        example {
          reviewerName
          reviewText
        }
      }
      negativeThemes {
        theme
        description
        example {
          reviewerName
          reviewText
        }
      }
    }
  }
`

// Theme colors matching UI screenshot
const themeColors = {
  positive: '#e8f5e9', // light green
  neutral: '#e3f2fd', // light blue
  negative: '#ffebee', // light pink
}

type ReviewSentimentData = {
  positive: number
  neutral: number
  negative: number
}

type ReviewSentimentAnalysisProps = {
  groupId: string
  reviewSentiment?: ReviewSentimentData | any
  analyticsRestricted?: boolean
}

const ReviewSentimentAnalysis: React.FC<ReviewSentimentAnalysisProps> = ({
  groupId,
  reviewSentiment,
  analyticsRestricted = false,
}) => {
  const { formatMessage, locale } = useIntl()
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    positive: true,
    neutral: true,
    negative: true,
  })

  // Fetch detailed sentiment analysis
  const { data, loading, error } = useQuery(REVIEW_SENTIMENT_ANALYSIS_QUERY, {
    variables: { groupId, locale },
    skip: !groupId || analyticsRestricted,
  })

  // Toggle expanded state for a section
  const toggleSection = (section: 'positive' | 'neutral' | 'negative') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Skip rendering if analytics are restricted
  if (analyticsRestricted) {
    return null
  }

  // Get sentiment counts from the dashboard data
  const sentimentCounts = {
    positive: reviewSentiment?.positive || 0,
    neutral: reviewSentiment?.neutral || 0,
    negative: reviewSentiment?.negative || 0,
  }

  // Prepare data for pie chart
  const chartData = [
    {
      id: 'Positive',
      label: formatMessage({ id: 'review.sentiment.positive' }),
      value: sentimentCounts.positive,
      color: themeColors.positive,
    },
    {
      id: 'Neutral',
      label: formatMessage({ id: 'review.sentiment.neutral' }),
      value: sentimentCounts.neutral,
      color: themeColors.neutral,
    },
    {
      id: 'Negative',
      label: formatMessage({ id: 'review.sentiment.negative' }),
      value: sentimentCounts.negative,
      color: themeColors.negative,
    },
  ]

  if (loading) {
    return (
      <Panel>
        <Panel.Header
          heading={formatMessage({ id: 'review.sentiment.title' })}
        />
        <Panel.Body>
          <Skeleton height={300} />
        </Panel.Body>
      </Panel>
    )
  }

  if (error) {
    return (
      <Panel>
        <Panel.Header
          heading={formatMessage({ id: 'review.sentiment.title' })}
        />
        <Panel.Body>
          <div className="text-red-500">
            {formatMessage({ id: 'review.sentiment.error' })} {error.message}
          </div>
        </Panel.Body>
      </Panel>
    )
  }

  // Display themes from analysis
  const renderThemes = () => {
    if (!data?.reviewSentimentAnalysis) return null

    return (
      <div className="mt-6 space-y-6">
        <h3 className="text-lg font-medium">
          {formatMessage({ id: 'review.sentiment.analysis' })}
        </h3>
        <p className="text-gray-600">
          {data.reviewSentimentAnalysis.sentimentSummary}
        </p>

        {/* Positive Themes */}
        {data.reviewSentimentAnalysis.positiveThemes.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('positive')}
            >
              {expandedSections.positive ? (
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
              <h4 className="font-medium text-green-800">
                {formatMessage({ id: 'review.sentiment.positiveThemes' })}
              </h4>
            </div>
            {expandedSections.positive && (
              <div className="space-y-3 mt-2">
                {data.reviewSentimentAnalysis.positiveThemes.map(
                  (theme: any, index: number) => (
                    <div
                      key={`positive-${index}`}
                      className="border-l-4 border-green-400 pl-3"
                    >
                      <p className="font-medium">{theme.theme}</p>
                      <p className="text-sm text-gray-600">
                        {theme.description}
                      </p>
                      <div className="mt-2 bg-white p-3 rounded text-sm italic">
                        &quot;{theme.example.reviewText}&quot; -{' '}
                        {theme.example.reviewerName}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Neutral Themes */}
        {data.reviewSentimentAnalysis.neutralThemes.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('neutral')}
            >
              {expandedSections.neutral ? (
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
              <h4 className="font-medium text-blue-800">
                {formatMessage({ id: 'review.sentiment.neutralThemes' })}
              </h4>
            </div>
            {expandedSections.neutral && (
              <div className="space-y-3 mt-2">
                {data.reviewSentimentAnalysis.neutralThemes.map(
                  (theme: any, index: number) => (
                    <div
                      key={`neutral-${index}`}
                      className="border-l-4 border-blue-400 pl-3"
                    >
                      <p className="font-medium">{theme.theme}</p>
                      <p className="text-sm text-gray-600">
                        {theme.description}
                      </p>
                      <div className="mt-2 bg-white p-3 rounded text-sm italic">
                        &quot;{theme.example.reviewText}&quot; -{' '}
                        {theme.example.reviewerName}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Negative Themes */}
        {data.reviewSentimentAnalysis.negativeThemes.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('negative')}
            >
              {expandedSections.negative ? (
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
              <h4 className="font-medium text-red-800">
                {formatMessage({ id: 'review.sentiment.negativeThemes' })}
              </h4>
            </div>
            {expandedSections.negative && (
              <div className="space-y-3 mt-2">
                {data.reviewSentimentAnalysis.negativeThemes.map(
                  (theme: any, index: number) => (
                    <div
                      key={`negative-${index}`}
                      className="border-l-4 border-red-400 pl-3"
                    >
                      <p className="font-medium">{theme.theme}</p>
                      <p className="text-sm text-gray-600">
                        {theme.description}
                      </p>
                      <div className="mt-2 bg-white p-3 rounded text-sm italic">
                        &quot;{theme.example.reviewText}&quot; -{' '}
                        {theme.example.reviewerName}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Panel>
      <Panel.Header heading={formatMessage({ id: 'review.sentiment.title' })} />
      <Panel.Body>
        <SectionHelpText
          text={formatMessage({ id: 'review.sentiment.helpText' })}
        />

        <div className="flex justify-center my-6">
          <div className="w-full max-w-xs h-64">
            <ResponsivePie
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={(d) => d.data.color}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 30,
                  itemsSpacing: 0,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        {/* Display detailed themes analysis */}
        {renderThemes()}
      </Panel.Body>
    </Panel>
  )
}

export default ReviewSentimentAnalysis
