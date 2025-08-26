import { ApolloProvider } from '@apollo/client'
import IntlProvider from 'components/IntlProvider'
import absoluteUrl from 'lib/absoluteUrl'
import env from 'lib/env'
import { parseDomain } from 'lib/envUtils'
import { validateLocale } from 'lib/getLocale'
import getMessages from 'lib/getMessages'
import { GroupProvider } from 'lib/GroupContext'
import { NextQueryParamProvider } from 'lib/next-query-params'
import { GetServerSideProps, GetStaticProps } from 'next'

import createApolloClient from './apolloClient'

export function connectStaticPaths(path?: string) {
  const paths = path ? [`/en/${path}`, `/fr/${path}`] : []

  return async function getStaticPaths() {
    return {
      paths,
      fallback: 'blocking',
    }
  }
}

type StaticProps = {
  locale?: string
  params?: { groupId?: string }
}

const runQueries = async (Component: any, locale: string, params: any) => {
  const { getDataFromTree } = await import('@apollo/client/react/ssr')

  const client = createApolloClient()
  const messages = getMessages(locale)

  await getDataFromTree(
    <NextQueryParamProvider>
      <ApolloProvider client={client}>
        <IntlProvider locale={locale} messages={messages}>
          <GroupProvider hasServerSideProps={true} groupId={params.groupId}>
            <Component {...params} />
          </GroupProvider>
        </IntlProvider>
      </ApolloProvider>
    </NextQueryParamProvider>
  )

  const props = {
    apolloState: client.cache.extract(),
    locale,
    hasServerSideProps: true,
    ...params,
  }

  return props
}

export function connectStaticProps(Component: any) {
  const getStaticProps: GetStaticProps = async ({
    locale = 'en',
    params = { groupId: undefined },
  }: StaticProps) => {
    const props = await runQueries(Component, locale, params)

    return {
      props: props,
      revalidate: 10,
    }
  }

  return getStaticProps
}

export function connectServerSideProps(Component?: any) {
  const getServerSideProps: GetServerSideProps = async (ctx) => {
    const url = absoluteUrl(ctx.req)

    // TODO grab token from ctx.req.cookies

    const parts = parseDomain(
      url.hostname,
      env.hostnames,
      env.forceCustomDomain
    )
    const locale = validateLocale(ctx.query.locale)
    const params = {
      hasServerSideProps: true,
      host: url.host,
      ...parts,
    }

    if (!Component) {
      return { props: params }
    }

    const props = await runQueries(Component, locale, params)

    return {
      props: props,
    }
  }

  return getServerSideProps
}
