import { VFC } from 'react'
import ReactCookieConsent from 'react-cookie-consent'
import { useIntl } from 'react-intl'

type CookieMessageProps = {
  locale: string
}

const CookieMessage: VFC<CookieMessageProps> = ({ locale }) => {
  if (locale === 'fr') {
    return (
      <>
        Nous utilisons des cookies pour analyser le trafic du site et nous
        partageons également des informations sur votre utilisation de notre
        site avec des partenaires d&apo;analyse. En cliquant sur accepter, vous
        autorisez la réception de cookies{' '}
        <a href="https://www.intercom.com/terms-and-policies#cookie-policy">
          Intercom
        </a>
        , <a href="https://www.fullstory.com/legal/privacy/">Fullstory</a>, et{' '}
        <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
          Google Analytics
        </a>{' '}
        qui analysent et mesurent votre engagement sur le site Web Mentorly.
        Vous pouvez{' '}
        <a href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=fr">
          modifier vos paramètres de cookies
        </a>{' '}
        à tout moment.
      </>
    )
  }

  return (
    <>
      We use cookies to analyze site traffic. We also share information about
      your use of our site with analytics partners. By clicking accept,
      you&apos;re allowing to receive{' '}
      <a href="https://www.intercom.com/terms-and-policies#cookie-policy">
        Intercom
      </a>
      , <a href="https://www.fullstory.com/legal/privacy/">Fullstory</a>, and{' '}
      <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
        Google Analytics
      </a>{' '}
      cookies that analyze and measure your engagement on the Mentorly website.
      You can{' '}
      <a href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en">
        {' '}
        change your cookie settings
      </a>{' '}
      at anytime.
    </>
  )
}

export const CookieConsent: VFC = () => {
  const { formatMessage, locale } = useIntl()

  return (
    <ReactCookieConsent
      buttonText={formatMessage({ id: 'button.accept' })}
      buttonWrapperClasses="self-end"
    >
      <CookieMessage locale={locale} />
    </ReactCookieConsent>
  )
}

export default CookieConsent
