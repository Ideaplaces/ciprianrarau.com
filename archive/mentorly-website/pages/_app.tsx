import 'focus-visible'
import 'react-datepicker/dist/react-datepicker.css'
import 'rc-slider/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-big-calendar/lib/sass/styles.scss'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/index.css'

import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { Elements as StripeProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import AnalyticsProvider from 'components/AnalyticsProvider'
import IESupport from 'components/IESupport'
import Intercom from 'components/Intercom'
import IntlProvider from 'components/IntlProvider'
import Layout from 'components/Layout'
import LogRocketProvider from 'components/LogRocketProvider'
import ModalProvider from 'components/Modal/ModalContext'
import Redirect from 'components/Redirect'
import { initApolloClient } from 'lib/apollo'
import env from 'lib/env'
import { validateLocale } from 'lib/getLocale'
import getMessages from 'lib/getMessages'
import { GroupProvider } from 'lib/GroupContext'
import isBrowser from 'lib/isBrowser'
import { NextQueryParamProvider } from 'lib/next-query-params'
import { UserProvider } from 'lib/UserContext'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { FC, useMemo } from 'react'
import { getCookieConsentValue } from 'react-cookie-consent'
import TagManager from 'react-gtm-module'
import LinkedInTag from 'react-linkedin-insight'
import { resetIdCounter } from 'react-tabs'
import { ToastContainer } from 'react-toastify'
import { PageLayoutProps } from 'types/layout'
import * as yup from 'yup'

const consent = getCookieConsentValue()

if (isBrowser()) {
  if (process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID) {
    LinkedInTag.init(
      process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
      'dc',
      !consent
    )
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
    TagManager.initialize({
      gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    })
  }
}
// User information is now passed to GA to enhance analytics reporting

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env.env,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

yup.setLocale({
  mixed: {
    default: ({ path }) => ({ id: 'form.invalidField', values: { path } }),
    required: ({ path }) => ({ id: 'form.requiredField', values: { path } }),
  },
  number: {
    max: ({ max, path }) => ({
      id: 'form.validation.number.max',
      values: { max, path },
    }),
    min: ({ min, path }) => ({
      id: 'form.validation.number.min',
      values: { min, path },
    }),
  },
  string: {
    email: ({ path }) => ({
      id: 'form.validation.string.email',
      values: { path },
    }),
    url: ({ path }) => ({ id: 'form.validation.string.url', values: { path } }),
    max: ({ max, path }) => ({
      id: 'form.validation.string.max',
      values: { max, path },
    }),
    min: ({ min, path }) => ({
      id: 'form.validation.string.min',
      values: { min, path },
    }),
  },
})

type PageProps = {
  apolloState: NormalizedCacheObject
  groupId?: any
  hasServerSideProps: boolean
  locale?: string
}

export type PageComponentProps = AppProps['Component'] & PageLayoutProps

type CustomAppProps = AppProps & {
  Component: PageComponentProps
  pageProps: PageProps
}

const MAINTENANCE_MODE = false

const App: FC<CustomAppProps> = ({ pageProps, router, Component }) => {
  const locale = validateLocale(router.query.locale)

  const stripePromise = useMemo(
    () =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '', {
        locale,
      }),
    [locale]
  )

  const { apolloState, ...props } = pageProps

  const client = initApolloClient(apolloState, undefined, props)

  const Wrapper = Component.Layout || Layout

  const messages = getMessages(locale, props.groupId)
  resetIdCounter()

  if (MAINTENANCE_MODE && !Component.maintenance) {
    return <Redirect url="/maintenance" />
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      <NextNProgress color="#7684F3" options={{ showSpinner: false }} />
      <IESupport>
        <NextQueryParamProvider>
          <ApolloProvider client={client}>
            <StripeProvider stripe={stripePromise}>
              <GroupProvider
                hasServerSideProps={props.hasServerSideProps}
                groupId={props.groupId}
              >
                <UserProvider>
                  <ModalProvider>
                    {isBrowser() && env.intercomAppId && (
                      <Intercom appId={env.intercomAppId} />
                    )}
                    <LogRocketProvider appID={env.logRocketID} />
                    <Wrapper {...props}>
                      <AnalyticsProvider>
                        <GoogleAnalytics trackPageViews />
                        <Component {...props} key={router.route} />
                      </AnalyticsProvider>
                    </Wrapper>
                  </ModalProvider>
                </UserProvider>
              </GroupProvider>
            </StripeProvider>
          </ApolloProvider>
        </NextQueryParamProvider>
      </IESupport>
      <ToastContainer autoClose={2000} position="bottom-left" hideProgressBar />
    </IntlProvider>
  )
}

export default App
