import Chart, { ChartType, TooltipItem } from 'chart.js/auto'
import Panel from 'components/display/Panel'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

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
  gapLevel?: number
}

interface KnowledgeGapVisualizationProps {
  gaps?: KnowledgeGap[]
  knowledgeGaps?: KnowledgeGapItem[]
  summary?: string
  onViewDebugInfo?: () => void
}

const KnowledgeGapVisualization: React.FC<KnowledgeGapVisualizationProps> = ({
  knowledgeGaps = [],
  gaps: _gaps = [], // Prefix with _ to indicate it's unused
  summary,
  onViewDebugInfo,
}) => {
  const { formatMessage } = useIntl()
  const [_showDebugInfo, _setShowDebugInfo] = useState(false)

  // Refs for chart canvases
  const radarChartRef = useRef<HTMLCanvasElement>(null)
  const radarChart2Ref = useRef<HTMLCanvasElement>(null)
  const dumbbellChartRef = useRef<HTMLCanvasElement>(null)

  // Chart instances
  const chartInstances = useRef<{
    radarChart: Chart | null
    radarChart2: Chart | null
    dumbbellChart: Chart | null
  }>({
    radarChart: null,
    radarChart2: null,
    dumbbellChart: null,
  })

  // Process raw data for charts
  useEffect(() => {
    if (!knowledgeGaps || knowledgeGaps.length === 0) return

    // Sort and get top gaps
    const sortedGaps = [...knowledgeGaps]
      .filter((item) => item.gap !== 0)
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
      .slice(0, 10)

    // Clean up previous chart instances
    if (chartInstances.current.radarChart) {
      chartInstances.current.radarChart.destroy()
    }
    if (chartInstances.current.radarChart2) {
      chartInstances.current.radarChart2.destroy()
    }
    if (chartInstances.current.dumbbellChart) {
      chartInstances.current.dumbbellChart.destroy()
    }

    // Process the raw gaps
    const processedGaps = processRawGaps(sortedGaps)

    // Create the charts
    if (radarChartRef.current) {
      chartInstances.current.radarChart = createRadarChart(
        radarChartRef.current,
        processedGaps
      )
    }

    if (radarChart2Ref.current) {
      chartInstances.current.radarChart2 = createDemandSupplyRadar(
        radarChart2Ref.current,
        sortedGaps
      )
    }

    if (dumbbellChartRef.current) {
      chartInstances.current.dumbbellChart = createDumbbellChart(
        dumbbellChartRef.current,
        sortedGaps
      )
    }

    // Cleanup function
    return () => {
      if (chartInstances.current.radarChart) {
        chartInstances.current.radarChart.destroy()
      }
      if (chartInstances.current.radarChart2) {
        chartInstances.current.radarChart2.destroy()
      }
      if (chartInstances.current.dumbbellChart) {
        chartInstances.current.dumbbellChart.destroy()
      }
    }
  }, [knowledgeGaps])

  // Only render if we have raw data
  if (!knowledgeGaps || knowledgeGaps.length === 0) {
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

  // Process raw gaps into formatted gap objects
  const processRawGaps = (rawGaps: KnowledgeGapItem[]) => {
    // Check if we already have gapLevel calculated from backend
    if (rawGaps.length > 0 && rawGaps[0].gapLevel !== undefined) {
      return rawGaps.map((gap) => ({
        skill: gap.name,
        gapLevel: gap.gapLevel as number,
        description: `There is a gap in ${gap.name} skills with ${gap.menteeCount} mentees seeking guidance but only ${gap.mentorCount} mentors available.`,
        recommendations: [
          `Recruit more mentors with expertise in ${gap.name}.`,
          `Develop focused training programs for ${gap.name}.`,
          `Create peer learning groups for ${gap.name} skill development.`,
        ],
      }))
    }

    // Otherwise calculate it based on gap values
    // Dynamically find the maximum gap value
    const maxGap = Math.max(...rawGaps.map((gap) => gap.gap))

    return rawGaps.map((gap) => {
      // Calculate a gap level between 0-10
      const gapLevel = 10 - Math.round((gap.gap / maxGap) * 10)

      return {
        skill: gap.name,
        gapLevel: gapLevel,
        description: `There is a gap in ${gap.name} skills with ${gap.menteeCount} mentees seeking guidance but only ${gap.mentorCount} mentors available.`,
        recommendations: [
          `Recruit more mentors with expertise in ${gap.name}.`,
          `Develop focused training programs for ${gap.name}.`,
          `Create peer learning groups for ${gap.name} skill development.`,
        ],
      }
    })
  }

  // Create radar chart
  const createRadarChart = (canvas: HTMLCanvasElement, data: any[]) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    return new Chart(ctx, {
      type: 'radar' as ChartType,
      data: {
        labels: data.map((item) => item.skill),
        datasets: [
          {
            label: 'Gap Level',
            data: data.map((item) => 10 - item.gapLevel), // Invert for visualization
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderColor: 'rgba(52, 152, 219, 1)',
            pointBackgroundColor: 'rgba(52, 152, 219, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              callback: function (tickValue: string | number) {
                // Invert values for display
                return 10 - Number(tickValue)
              },
              backdropColor: 'rgba(255, 255, 255, 0.75)',
            },
            pointLabels: {
              font: {
                size: 12,
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context: TooltipItem<ChartType>) {
                return `Gap Level: ${10 - Number(context.raw)}`
              },
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    })
  }

  // Create demand vs supply radar chart
  const createDemandSupplyRadar = (
    canvas: HTMLCanvasElement,
    data: KnowledgeGapItem[]
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    return new Chart(ctx, {
      type: 'radar' as ChartType,
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: 'Mentee Demand',
            data: data.map((item) => item.menteeCount),
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            borderColor: 'rgba(231, 76, 60, 1)',
            pointBackgroundColor: 'rgba(231, 76, 60, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 2,
          },
          {
            label: 'Mentor Supply',
            data: data.map((item) => item.mentorCount),
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            borderColor: 'rgba(46, 204, 113, 1)',
            pointBackgroundColor: 'rgba(46, 204, 113, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: Math.max(...data.map((item) => item.menteeCount)) + 5,
            ticks: {
              backdropColor: 'rgba(255, 255, 255, 0.75)',
            },
            pointLabels: {
              font: {
                size: 12,
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                return context[0].label
              },
              label: function (context: TooltipItem<ChartType>) {
                if (context.datasetIndex === 0) {
                  return `Mentee Demand: ${context.raw}`
                } else {
                  return `Mentor Supply: ${context.raw}`
                }
              },
              afterLabel: function (context: TooltipItem<ChartType>) {
                const dataIndex = context.dataIndex
                const gap = data[dataIndex].gap
                return `Gap: ${gap}`
              },
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    })
  }

  // Create dumbbell chart
  const createDumbbellChart = (
    canvas: HTMLCanvasElement,
    data: KnowledgeGapItem[]
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Custom plugin to draw the lines between points
    const dumbbellPlugin = {
      id: 'dumbbell',
      afterDraw: (chart: Chart) => {
        const ctx = chart.ctx
        const xAxis = chart.scales['x']
        const yAxis = chart.scales['y']
        const dataset1 = chart.data.datasets[0] // Mentee demand
        const dataset2 = chart.data.datasets[1] // Mentor supply

        ctx.save()

        // For each pair of points (demand and supply)
        for (let i = 0; i < (dataset1.data as any[]).length; i++) {
          // Get x and y coordinates for both points
          const menteeX = (dataset1.data as any[])[i].x
          const mentorX = (dataset2.data as any[])[i].x
          const y = i // y-index in the sorted data

          // Draw connecting line (thicker and more visible)
          const x1 = xAxis.getPixelForValue(menteeX)
          const y1 = yAxis.getPixelForValue(y)
          const x2 = xAxis.getPixelForValue(mentorX)
          const y2 = y1 // Same y position

          // Create a gradient from green (mentor) to red (mentee)
          try {
            const gradient = ctx.createLinearGradient(x2, y2, x1, y1)
            gradient.addColorStop(0, 'rgba(46, 204, 113, 0.8)') // Green (mentor)
            gradient.addColorStop(1, 'rgba(231, 76, 60, 0.8)') // Red (mentee)

            ctx.beginPath()
            ctx.strokeStyle = gradient
            ctx.lineWidth = 3
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          } catch (_err) {
            // Fallback to solid color if gradient fails
            ctx.beginPath()
            ctx.strokeStyle = '#e74c3c' // Red for the line
            ctx.lineWidth = 3
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }

          // Add gap value in the middle of the line
          const gap = data[i].gap
          const midX = (x1 + x2) / 2
          const midY = y1

          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'

          // Draw a white background for the text to make it more readable
          const textWidth = ctx.measureText(gap.toString()).width + 10
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.fillRect(midX - textWidth / 2, midY - 15, textWidth, 20)

          // Draw the gap value
          ctx.fillStyle = '#e74c3c'
          ctx.fillText(`${gap}`, midX, midY)
        }

        ctx.restore()
      },
    }

    return new Chart(ctx, {
      type: 'scatter' as ChartType,
      plugins: [dumbbellPlugin],
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: 'Mentee Demand',
            data: data.map((item, index) => ({
              x: item.menteeCount,
              y: index,
            })),
            backgroundColor: 'rgba(231, 76, 60, 1)',
            borderColor: 'rgba(231, 76, 60, 1)',
            pointRadius: 8,
            pointHoverRadius: 10,
          },
          {
            label: 'Mentor Supply',
            data: data.map((item, index) => ({
              x: item.mentorCount,
              y: index,
            })),
            backgroundColor: 'rgba(46, 204, 113, 1)',
            borderColor: 'rgba(46, 204, 113, 1)',
            pointRadius: 8,
            pointHoverRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'category',
            labels: data.map((item) => item.name),
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          x: {
            min: 0,
            grid: {
              color: 'rgba(200, 200, 200, 0.2)',
            },
            title: {
              display: true,
              text: 'Count',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            callbacks: {
              title: function (context) {
                return context[0].label
              },
              label: function (context: TooltipItem<ChartType>) {
                const datasetLabel = context.dataset.label || ''
                const value = context.parsed.x
                return `${datasetLabel}: ${value}`
              },
              afterLabel: function (context: TooltipItem<ChartType>) {
                const index = context.parsed.y
                const gap = data[index].gap
                return `Gap: ${gap}`
              },
            },
          },
        },
      },
    })
  }

  return (
    <Panel>
      <Panel.Header
        heading={formatMessage({ id: 'analytics.knowledgeGap' })}
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

        {/* Radar Charts Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Radar Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-medium mb-2 text-center">
                Gap Level Radar
              </h3>
              <div className="h-[300px]">
                <canvas ref={radarChartRef}></canvas>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-medium mb-2 text-center">
                Demand vs Supply Radar
              </h3>
              <div className="h-[300px]">
                <canvas ref={radarChart2Ref}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Analysis Chart Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Gap Analysis Chart</h2>
          <p className="text-gray-700 mb-3">
            {formatMessage({ id: 'analytics.chartGapAnalysisExplanation' })}
          </p>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-[400px]">
              <canvas ref={dumbbellChartRef}></canvas>
            </div>
          </div>
        </div>
      </Panel.Body>
    </Panel>
  )
}

export default KnowledgeGapVisualization
