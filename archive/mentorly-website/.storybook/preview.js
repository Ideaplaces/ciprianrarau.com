import '../styles/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import IntlProvider from 'components/IntlProvider'
import getMessages from 'lib/getMessages'
import { MockedProvider } from '@apollo/client/testing'
import { RouterContext } from 'next/dist/shared/lib/router-context' // next 11.1
import ModalProvider from 'components/Modal/ModalContext'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  apolloClient: {
    MockedProvider,
    addTypename: false,
    // any props we want to pass to MockedProvider on every story
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withProviders = (Story, context) => {
  const locale = 'en'
  const messages = getMessages(locale)

  return (
    <IntlProvider messages={messages} locale={locale}>
      <ModalProvider>
        <Story {...context} />
      </ModalProvider>
    </IntlProvider>
  )
}
export const decorators = [withProviders]
