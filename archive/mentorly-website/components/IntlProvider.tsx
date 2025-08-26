import cookie from 'js-cookie'
import getMessages from 'lib/getMessages'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'

const LocaleContext = React.createContext({})

export const useLocale = () => React.useContext(LocaleContext)

const cache = createIntlCache()

export type MessageType = Record<string, string>

type IntlProviderProps = {
  children: ReactNode
  locale: string
  messages?: MessageType
}

const IntlProvider: FC<IntlProviderProps> = ({
  children,
  locale,
  messages,
}) => {
  const [intl, setIntl] = useState(createIntl({ locale, messages }, cache))

  const setLocale = async (nextLocale: string) => {
    // only triggered by used in this case go and fetch new locale data
    const nextMessages = await getMessages(nextLocale)
    setIntl(createIntl({ locale: nextLocale, messages: nextMessages }, cache))
    cookie.set('locale', nextLocale, { expires: 365 })
  }

  useEffect(() => {
    setIntl(createIntl({ locale, messages }, cache))
  }, [locale])

  return (
    <LocaleContext.Provider value={{ setLocale }}>
      <RawIntlProvider value={intl}>{children}</RawIntlProvider>
    </LocaleContext.Provider>
  )
}

export default IntlProvider
