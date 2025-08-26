import { ResponsiveBar } from '@nivo/bar'
import Panel from 'components/display/Panel'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

interface SkillGap {
  skill: string
  gapLevel: number
  description: string
  recommendations: string[]
}

interface SkillGapItem {
  name: string
  type: string
  mentee_count: number
  mentor_count: number
  gap: number
}

// Define interface for typesafe index signature
interface StringRecord {
  [key: string]: string | number
}

// Define types for our chart data with type-safe index signatures
interface RawChartData extends StringRecord {
  skill: string
  type: string
  mentees: number
  mentors: number
  demand: number
  supply: number
  gap: number
}

interface ProcessedChartData extends StringRecord {
  skill: string
  gap_level: number
  demand: number
  // Using string type for description (will be set to empty string if undefined)
  description: string
}

// Define the range structure
interface GapRanges {
  low: [number, number]
  medium: [number, number]
  high: [number, number]
}

interface SkillGapVisualizationProps {
  gaps?: SkillGap[]
  skillGaps?: SkillGapItem[]
  summary?: string
  onViewDebugInfo?: () => void
}

const SkillGapVisualization: React.FC<SkillGapVisualizationProps> = ({
  gaps,
  skillGaps,
  summary,
  onViewDebugInfo,
}) => {
  const { formatMessage } = useIntl()

  // Transform data for visualization
  const { barData, gapRanges, isRawDataFormat } = useMemo(() => {
    // If we have raw data from skillGaps, use that
    if (skillGaps && skillGaps.length > 0) {
      // Sort by gap value (highest gap first - most in demand skills)
      const sorted = [...skillGaps]
        .filter((item) => item.gap !== 0) // Filter out items with no gap
        .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)) // Sort by absolute gap size

      // Take top gaps for visualization
      const topGaps = sorted.slice(0, 10)

      // Transform to the expected bar chart format
      const rawData: RawChartData[] = topGaps.map((item) => ({
        skill: item.name,
        type: item.type,
        mentees: item.mentee_count,
        mentors: item.mentor_count,
        // For diverging chart, we'll use positive/negative values
        demand: item.gap > 0 ? item.gap : 0,
        supply: item.gap < 0 ? -item.gap : 0, // Convert negative to positive
        gap: item.gap,
      }))

      return {
        barData: rawData,
        gapRanges: null as GapRanges | null, // Not needed for raw data view
        isRawDataFormat: true,
      }
    }

    // If we don't have raw data, use the processed gaps instead
    if (gaps && gaps.length > 0) {
      // Sort by gap value (lowest gapLevel first - most in-demand skills)
      const sorted = [...gaps].sort((a, b) => a.gapLevel - b.gapLevel)

      // Take the top gaps for visualization
      const topGaps = sorted.slice(0, 10)

      // Calculate dynamic ranges based on actual data
      const gapValues = topGaps.map((item) => item.gapLevel)
      const minGap = Math.min(...gapValues)
      const maxGap = Math.max(...gapValues)
      const range = maxGap - minGap

      // Create three ranges evenly distributed across the actual data
      const rangeSize = range / 3 || 1
      const lowRange = [minGap, minGap + rangeSize]
      const mediumRange = [minGap + rangeSize + 0.01, minGap + 2 * rangeSize]
      const highRange = [minGap + 2 * rangeSize + 0.01, maxGap]

      // Round range values for display
      const dynamicGapRanges: GapRanges = {
        low: [Math.round(lowRange[0]), Math.round(lowRange[1])],
        medium: [Math.round(mediumRange[0]), Math.round(mediumRange[1])],
        high: [Math.round(highRange[0]), Math.round(highRange[1])],
      }

      // Transform to the expected bar chart format
      const processedData: ProcessedChartData[] = topGaps.map((item) => ({
        skill: item.skill,
        gap_level: item.gapLevel,
        demand: item.gapLevel,
        // Use empty string if description is undefined to satisfy the type system
        description: item.description || '',
      }))

      return {
        barData: processedData,
        gapRanges: dynamicGapRanges,
        isRawDataFormat: false,
      }
    }

    return {
      barData: [] as (RawChartData | ProcessedChartData)[],
      gapRanges: null as GapRanges | null,
      isRawDataFormat: false,
    }
  }, [gaps, skillGaps])

  // Only render if we have raw data
  if (!skillGaps || skillGaps.length === 0) {
    return (
      <Panel>
        <Panel.Header heading="Knowledge Gap" />
        <Panel.Body>
          <div className="text-center py-4 text-gray-500">
            No knowledge gap data available.
          </div>
        </Panel.Body>
      </Panel>
    )
  }

  return (
    <Panel>
      <Panel.Header
        heading="Knowledge Gap"
        action={
          onViewDebugInfo && (
            <button
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
              onClick={onViewDebugInfo}
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
          )
        }
      />
      <Panel.Body>
        {summary && (
          <div className="mb-4">
            <p className="text-gray-700">{summary}</p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-700">
            {formatMessage({ id: 'analytics.chartGapExplanation' })}
          </p>
        </div>

        <div className="h-[400px]">
          {isRawDataFormat ? (
            // Raw data diverging chart (demand/supply)
            <ResponsiveBar
              data={barData as RawChartData[]}
              keys={['demand', 'supply']}
              indexBy="skill"
              margin={{ top: 20, right: 120, bottom: 50, left: 150 }}
              padding={0.4}
              groupMode="grouped"
              layout="horizontal"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              reverse={true}
              colors={({ id }) => (id === 'demand' ? '#ef4444' : '#3b82f6')} // red for demand, blue for supply
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Gap Level',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Skills',
                legendPosition: 'middle',
                legendOffset: -130,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              tooltip={({ id, value, color, data }) => {
                const rawData = data as RawChartData
                return (
                  <div className="bg-white p-2 shadow-md rounded border">
                    <strong>{rawData.skill}</strong> ({rawData.type})
                    <div style={{ color }}>
                      {id === 'demand'
                        ? 'Demand Exceeding Supply: '
                        : 'Supply Exceeding Demand: '}
                      {value}
                    </div>
                    <div className="text-sm mt-1">
                      Mentee demand: {rawData.mentees}, Mentor supply:{' '}
                      {rawData.mentors}
                    </div>
                  </div>
                )
              }}
            />
          ) : (
            // Processed data bar chart (gap levels)
            <ResponsiveBar
              data={barData as ProcessedChartData[]}
              keys={['demand']}
              indexBy="skill"
              margin={{ top: 20, right: 120, bottom: 50, left: 150 }}
              padding={0.3}
              layout="horizontal"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              reverse={true}
              colors={({ data }) => {
                // Use dynamic ranges based on actual data
                const processedData = data as ProcessedChartData
                const value = processedData.gap_level
                if (gapRanges) {
                  return value <= gapRanges.low[1]
                    ? '#ef4444' // red for high demand (low numbers)
                    : value <= gapRanges.medium[1]
                    ? '#f97316' // orange for medium
                    : '#3b82f6' // blue for low demand (high numbers)
                }
                return '#3b82f6' // default
              }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Gap Level',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Skills',
                legendPosition: 'middle',
                legendOffset: -130,
              }}
              enableGridX={true}
              enableGridY={false}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[]}
              tooltip={({ value, color, data }) => {
                const processedData = data as ProcessedChartData
                return (
                  <div className="bg-white p-2 shadow-md rounded border">
                    <strong>{processedData.skill}</strong>
                    <div style={{ color }}>Gap Level: {value}</div>
                    {processedData.description && (
                      <div className="text-sm mt-1">
                        {processedData.description}
                      </div>
                    )}
                  </div>
                )
              }}
            />
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {isRawDataFormat ? (
            <>
              <div className="flex items-center mr-8">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-700">
                  Demand exceeds supply
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-700">
                  Supply exceeds demand
                </span>
              </div>
            </>
          ) : (
            <>
              {gapRanges && (
                <>
                  <div className="flex items-center mr-8">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-700">
                      High demand gap ({gapRanges.low[0]}-{gapRanges.low[1]})
                    </span>
                  </div>
                  <div className="flex items-center mr-8">
                    <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                    <span className="text-sm text-gray-700">
                      Medium demand gap ({gapRanges.medium[0]}-
                      {gapRanges.medium[1]})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-700">
                      Low demand gap ({gapRanges.high[0]}-{gapRanges.high[1]})
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Panel.Body>
    </Panel>
  )
}

export default SkillGapVisualization
