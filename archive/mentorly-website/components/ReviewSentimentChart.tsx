import { gql, useQuery } from '@apollo/client'
import { ResponsivePie } from '@nivo/pie'
import React from 'react'
import { useIntl } from 'react-intl'

// GraphQL query to fetch review sentiment data
const REVIEW_SENTIMENT_QUERY = gql`
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

type ReviewSentimentChartProps = {
  groupId: string
  sentimentCounts?: {
    positive: number
    neutral: number
    negative: number
  }
}

const ReviewSentimentChart: React.FC<ReviewSentimentChartProps> = ({
  groupId,
  sentimentCounts = { positive: 0, neutral: 0, negative: 0 },
}) => {
  const { formatMessage, locale } = useIntl()

  // Fetch detailed sentiment analysis if needed
  const { data /* loading, error */ } = useQuery(REVIEW_SENTIMENT_QUERY, {
    variables: { groupId, locale },
    // Skip query if we just want to display the counts
    skip: !groupId,
  })

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
            <h4 className="font-medium text-green-800">
              {formatMessage({ id: 'review.sentiment.positiveThemes' })}
            </h4>
            <div className="space-y-3 mt-2">
              {data.reviewSentimentAnalysis.positiveThemes.map(
                (
                  theme: {
                    theme: string
                    description: string
                    example: { reviewerName: string; reviewText: string }
                  },
                  index: number
                ) => (
                  <div
                    key={`positive-${index}`}
                    className="border-l-4 border-green-400 pl-3"
                  >
                    <p className="font-medium">{theme.theme}</p>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                    <div className="mt-2 bg-white p-3 rounded text-sm italic">
                      &quot;{theme.example.reviewText}&quot; -{' '}
                      {theme.example.reviewerName}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Neutral Themes */}
        {data.reviewSentimentAnalysis.neutralThemes.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">
              {formatMessage({ id: 'review.sentiment.neutralThemes' })}
            </h4>
            <div className="space-y-3 mt-2">
              {data.reviewSentimentAnalysis.neutralThemes.map(
                (
                  theme: {
                    theme: string
                    description: string
                    example: { reviewerName: string; reviewText: string }
                  },
                  index: number
                ) => (
                  <div
                    key={`neutral-${index}`}
                    className="border-l-4 border-blue-400 pl-3"
                  >
                    <p className="font-medium">{theme.theme}</p>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                    <div className="mt-2 bg-white p-3 rounded text-sm italic">
                      &quot;{theme.example.reviewText}&quot; -{' '}
                      {theme.example.reviewerName}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Negative Themes */}
        {data.reviewSentimentAnalysis.negativeThemes.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800">
              {formatMessage({ id: 'review.sentiment.negativeThemes' })}
            </h4>
            <div className="space-y-3 mt-2">
              {data.reviewSentimentAnalysis.negativeThemes.map(
                (
                  theme: {
                    theme: string
                    description: string
                    example: { reviewerName: string; reviewText: string }
                  },
                  index: number
                ) => (
                  <div
                    key={`negative-${index}`}
                    className="border-l-4 border-red-400 pl-3"
                  >
                    <p className="font-medium">{theme.theme}</p>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                    <div className="mt-2 bg-white p-3 rounded text-sm italic">
                      &quot;{theme.example.reviewText}&quot; -{' '}
                      {theme.example.reviewerName}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row items-start">
        <div className="w-full md:w-1/3 h-64">
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

        <div className="w-full md:w-2/3 mt-6 md:mt-0 md:pl-6">
          <h2 className="text-2xl font-bold">
            {formatMessage({ id: 'review.sentiment.title' })}
          </h2>
          <p className="text-gray-600 mb-4">
            {formatMessage({ id: 'review.sentiment.feedback' })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-800 font-medium">
                {formatMessage({ id: 'review.sentiment.positive' })}
              </p>
              <p className="text-3xl font-bold">{sentimentCounts.positive}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                {formatMessage({ id: 'review.sentiment.neutral' })}
              </p>
              <p className="text-3xl font-bold">{sentimentCounts.neutral}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-red-800 font-medium">
                {formatMessage({ id: 'review.sentiment.negative' })}
              </p>
              <p className="text-3xl font-bold">{sentimentCounts.negative}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Display detailed themes analysis */}
      {renderThemes()}
    </div>
  )
}

export default ReviewSentimentChart
