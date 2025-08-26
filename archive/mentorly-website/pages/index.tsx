import getLocale from 'lib/getLocale'
import { useRouter } from 'lib/router'
import Head from 'next/head'
import React from 'react'

const locales = ['en', 'fr']
const defaultLocale = 'en'

const isLocale = (tested: string) => {
  return locales.some((locale) => locale === tested)
}

const getInitialLocale = () => {
  // preference from the previous session
  const localSetting = localStorage.getItem('locale')
  if (localSetting && isLocale(localSetting)) {
    return localSetting
  }

  // the language setting of the browser
  const [browserSetting] = navigator.language.split('-')
  if (isLocale(browserSetting)) {
    return browserSetting
  }

  return defaultLocale
}

const Index = () => {
  const router = useRouter()
  React.useEffect(() => {
    router.replace('/[lang]', `/${getInitialLocale()}`)
  })

  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  )
}

Index.getInitialProps = async (ctx: any) => {
  const locale = getLocale(ctx)
  const { query, res } = ctx

  if (res) {
    if (query.m) {
      res.writeHead(302, {
        Location: `/mentors?m=${query.m}`,
      })
    } else {
      res.writeHead(302, {
        Location: `/${locale}`,
      })
    }
    res.end('<head><meta name="robots" content="noindex, nofollow" /></head>')
  }

  return {}
}

export default Index
