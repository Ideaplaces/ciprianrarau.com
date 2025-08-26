import React from 'react'
import { useIntl } from 'react-intl'

interface SectionHelpTextProps {
  text: string
  translationId?: string
}

const SectionHelpText: React.FC<SectionHelpTextProps> = ({
  text,
  translationId,
}) => {
  const { formatMessage } = useIntl()

  // Use the translation if available, otherwise use provided text
  const displayText = translationId
    ? formatMessage({ id: translationId })
    : text

  return (
    <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
      <svg
        className="h-5 w-5 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>{displayText}</p>
    </div>
  )
}

export default SectionHelpText
