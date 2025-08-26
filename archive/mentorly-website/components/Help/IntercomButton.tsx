import { VFC } from 'react'
import { useIntl } from 'react-intl'

interface IntercomButtonLinkProps {
  messageId: string
}

const IntercomButtonLink: VFC<IntercomButtonLinkProps> = ({ messageId }) => {
  const { formatMessage } = useIntl()
  return (
    <button
      onClick={() =>
        process.env.NODE_ENV !== 'production'
          ? alert('this button only works in production')
          : undefined
      }
      id="custom_intercom_button"
      className="underline lowercase"
    >
      {formatMessage({ id: messageId })}
    </button>
  )
}

export default IntercomButtonLink
