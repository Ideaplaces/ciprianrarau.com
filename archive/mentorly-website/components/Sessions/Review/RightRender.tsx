import { VFC } from 'react'
import { useIntl } from 'react-intl'

type RightRenderProps = {
  isMarketplace?: boolean
  isMentor?: boolean
}

const RightRender: VFC<RightRenderProps> = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="flex flex-col relative mt-4 mb-20">
      <div className="flex justify-center mb-4">
        <img
          src="/images/review_01.png"
          alt={formatMessage(
            { id: 'review.alt' },
            { user: formatMessage({ id: 'term.mentors' }) }
          )}
          className="w-48 h-auto"
        />
      </div>
      <div className="flex flex-col items-start px-4">
        <h3 className="text-2xl font-black text-black mb-4">
          {formatMessage({ id: 'review.whatsNext.title' })}
        </h3>
        <div className="flex flex-col space-y-3 w-full">
          <div className="flex items-start space-x-3">
            <span className="text-lg">📝</span>
            <span className="text-sm text-gray-700">
              {formatMessage({ id: 'review.whatsNext.insight' })}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg">🎯</span>
            <span className="text-sm text-gray-700">
              {formatMessage({ id: 'review.whatsNext.goal' })}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg">💭</span>
            <span className="text-sm text-gray-700">
              {formatMessage({ id: 'review.whatsNext.challenge' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightRender
