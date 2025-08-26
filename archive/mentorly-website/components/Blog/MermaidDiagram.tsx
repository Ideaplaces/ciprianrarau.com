import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  className = '',
}) => {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        // Configuration for v10.9.1 - production-safe
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            primaryColor: '#f9f9f9',
            primaryTextColor: '#333',
            primaryBorderColor: '#333',
            lineColor: '#333',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 50,
            rankSpacing: 50,
            padding: 20,
          },
          // Changed from 'loose' to 'sandbox' for production compatibility
          securityLevel: 'sandbox',
          // Add production-specific configs
          logLevel: 'error',
        })

        // Generate unique id for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError('')
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
        setSvg('')
      }
    }

    if (chart) {
      renderDiagram()
    }
  }, [chart])

  // Apply CSS fixes after SVG is rendered
  useEffect(() => {
    if (svg && mermaidRef.current) {
      const container = mermaidRef.current
      const svgElement = container.querySelector('svg')

      if (svgElement) {
        // Create and inject CSS
        const style = document.createElement('style')
        style.textContent = `
          svg .nodeLabel {
            padding: 2px !important;
          }
          svg foreignObject {
            overflow: visible !important;
          }
        `

        container.appendChild(style)
      }
    }
  }, [svg])

  if (error) {
    return (
      <div
        className={`border border-red-300 bg-red-50 p-4 rounded-md ${className}`}
      >
        <p className="text-red-700 text-sm">Error rendering diagram: {error}</p>
        <details className="mt-2">
          <summary className="text-red-600 cursor-pointer text-xs">
            Show diagram code
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={`flex items-center justify-center p-8 bg-gray-50 rounded-md ${className}`}
      >
        <div className="text-gray-500">Loading diagram...</div>
      </div>
    )
  }

  return (
    <div
      ref={mermaidRef}
      className={`mermaid-container w-full overflow-x-auto py-4 ${className}`}
      style={{
        minHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default MermaidDiagram
