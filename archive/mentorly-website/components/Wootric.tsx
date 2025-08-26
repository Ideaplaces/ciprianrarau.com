import { useCurrentUser } from 'lib/UserContext'
import Script from 'next/script'
import { useIntl } from 'react-intl'

const Wootric = () => {
  const { currentUser } = useCurrentUser()
  const { formatMessage, locale } = useIntl()

  if (typeof window === 'undefined') {
    return null
  }

  const win = window as any

  if (!currentUser) {
    return null
  }

  const runWootricSettings = () => {
    win.wootricSettings = {
      email: currentUser.contactEmail,
      created_at: Math.round(Date.parse(currentUser.createdAt) / 1000),
      account_token: 'NPS-af7303ba',
      product_name: formatMessage({ id: 'text.thisPlatform' }),
      wootric_recommend_target: formatMessage({ id: 'text.others' }),
      properties: {
        role: currentUser.userRole,
      },
      language: locale.toUpperCase(),
    }

    if (win.wootric) {
      win.wootric('run')
    }
  }

  return (
    <Script
      id="run"
      strategy="afterInteractive"
      src="https://cdn.wootric.com/wootric-sdk.js"
      onError={(e: any) => {
        console.error('error: ', e)
      }}
      onLoad={() => runWootricSettings()}
    ></Script>
  )
}

export default Wootric
