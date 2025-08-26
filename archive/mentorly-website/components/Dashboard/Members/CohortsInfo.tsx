import Alert from 'components/feedback/Alert'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const CohortInfo = () => {
  const { formatMessage, locale } = useIntl()
  return (
    <Alert
      className="mb-6 mt-0"
      description={
        <Link
          href={`${
            locale === 'en'
              ? 'https://help.mentorly.co/en/articles/5517277-inviting-members-to-your-program#h_fef9996508'
              : 'https://help.mentorly.co/fr/articles/5517277-inviter-des-membres-a-votre-programme#h_9f1e13b3e0'
          }`}
        >
          <a target="_blank">{formatMessage({ id: 'tooltip.howToCohorts' })}</a>
        </Link>
      }
      showIcon
    />
  )
}

export default CohortInfo
