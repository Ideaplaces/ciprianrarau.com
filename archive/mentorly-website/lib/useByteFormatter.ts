import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

const useByteFormatter = (bytes?: Maybe<number>, precision: 0 | 1 | 2 = 2) => {
  const { formatMessage } = useIntl()

  if (!bytes) return null

  if (bytes === 0) return '0 bytes'

  const size = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${parseFloat(
    (bytes / Math.pow(1024, size)).toFixed(precision)
  )} ${formatMessage({
    id: `filesize.${['bytes', 'kb', 'mb', 'gb'][size]}`,
  })}`
}

export default useByteFormatter
