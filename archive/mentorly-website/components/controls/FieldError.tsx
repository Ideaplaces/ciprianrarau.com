import { FC } from 'react'
import { useIntl } from 'react-intl'

type ValidationError = {
  id: string
  values?: Record<string, any>
}

type FieldErrorProps = {
  error: string | ValidationError
}

const DEFAULT_ERROR = 'form.error'

const FieldError: FC<FieldErrorProps> = ({ error }) => {
  const { formatMessage } = useIntl()
  let text = null

  if (!error) {
    text = formatMessage({ id: DEFAULT_ERROR })
  } else if (typeof error === 'string') {
    text = formatMessage({ id: error })
  } else {
    text = formatMessage({ id: error.id }, error.values)
  }

  return (
    <div className="text-red p-1" data-testid="field-error">
      {text}
    </div>
  )
}

export default FieldError
