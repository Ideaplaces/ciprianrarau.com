import cookie from 'js-cookie'
import { useRouter } from 'lib/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type LanguageSwitchProps = {
  className?: string
  short?: boolean
}

const alternatePath = (
  path: string,
  locale: string,
  alternateLocale: string
) => {
  if (path === `/${locale}`) {
    return `/${alternateLocale}`
  }

  return path.replace(`/${locale}/`, `/${alternateLocale}/`)
}

const LanguageSwitch: FC<LanguageSwitchProps> = ({ className, short }) => {
  const router = useRouter()
  const { locale, formatMessage } = useIntl()
  const alternateLocale = locale === 'en' ? 'fr' : 'en'

  const text = short
    ? alternateLocale
    : formatMessage({ id: 'alternateLocale' })

  const onLanguageClick = () => {
    cookie.set('locale', alternateLocale, { expires: 365 })
  }

  const href = alternatePath(router.asPath, locale, alternateLocale)

  return (
    <a href={href} className={className} onClick={onLanguageClick}>
      {text}
    </a>
  )
}

export default LanguageSwitch
