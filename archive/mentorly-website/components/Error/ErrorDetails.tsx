import { useErrorDetails } from 'lib/error'
import { useIntl } from 'react-intl'

export type ErrorDetailType = {
  error: string
  value?: any
}
export type ErrorDetailsType = Record<string, ErrorDetailType[]>

export type ErrorDetailsProps = {
  errorDetails: ErrorDetailsType
}

const ErrorDetails: React.FC<any> = ({ errorDetails }: ErrorDetailsProps) => {
  const { locale } = useIntl()
  const { errors } = useErrorDetails(errorDetails, locale)

  if (!errors || errors.length === 0) return null
  if (errors.length === 1) return <>{errors[0]}</>
  if (errors.length > 1) {
    return (
      <ul className="list-disc ml-6">
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    )
  }
  return null
}

export default ErrorDetails
