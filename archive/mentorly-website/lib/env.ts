import { Maybe } from 'types/graphql'

enum Environment {
  development = 'development',
  staging = 'staging',
  production = 'production',
}

type envConfigType = {
  apiDomain: string
  development?: boolean
  staging?: boolean
  production?: boolean
  env: string
  clientDomain: string
  legacyDomain: string
  cookieDomain: Maybe<string>
  graphqlUrl: string
  hostnames: string[]
  port?: number
  scheme: string
  logRocketID?: string
  intercomAppId?: string
  forceCustomDomain: boolean
}

let env = Environment.development

if (process.env.NEXT_PUBLIC_BASE_URL === 'https://mentorly.co') {
  env = Environment.production
}

if (process.env.NEXT_PUBLIC_BASE_URL === 'https://mentorly.dev') {
  env = Environment.staging
}

if (process.env.NEXT_PUBLIC_BASE_URL === 'https://mentorly.com') {
  env = Environment.production
}

const graphqlUrl = `${process.env.NEXT_PUBLIC_API_URL}/graphql`

const envConfig: Record<Environment, envConfigType> = {
  development: {
    apiDomain: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    development: true,
    env: Environment.development,
    clientDomain: 'http://localhost:3010',
    legacyDomain: 'http://localhost:3030',
    cookieDomain: null,
    graphqlUrl: graphqlUrl,
    hostnames: ['mentorly.localhost', 'localtest.me', 'localhost'],
    port: 3010,
    scheme: 'http',
    logRocketID: 'nq434y/staging-ziuka',
    intercomAppId: 'jh99prcy',
    forceCustomDomain: false,
  },
  staging: {
    apiDomain: process.env.NEXT_PUBLIC_API_URL || 'https://api2.mentorly.co',
    staging: true,
    env: 'staging',
    clientDomain: 'https://mentorly.dev',
    legacyDomain: 'https://mentorly.dev',
    cookieDomain: 'mentorly.dev',
    graphqlUrl: graphqlUrl,
    hostnames: ['mentorly.dev'],
    scheme: 'https',
    logRocketID: 'nq434y/staging-ziuka',
    intercomAppId: 'jh99prcy',
    forceCustomDomain: false,
  },
  production: {
    apiDomain: process.env.NEXT_PUBLIC_API_URL || 'https://api.mentorly.com',
    production: true,
    env: 'production',
    clientDomain: 'https://mentorly.com',
    legacyDomain: 'https://mentorly.co',
    cookieDomain: 'mentorly.com',
    graphqlUrl: graphqlUrl,
    hostnames: ['mentorly.com', 'mentorly.co'],
    scheme: 'https',
    logRocketID: 'nq434y/production',
    intercomAppId: 'xvy5mqyt',
    forceCustomDomain: false,
  },
}

const currentConfig = envConfig[env]

const apiDomain = currentConfig.apiDomain

const tokenNames: Record<string, string> = {
  'https://api2.mentorly.co': 'staging-token',
  'https://api1.mentorly.co': 'token',
  'https://api.mentorly.com': 'token',
}

const DEFAULT_TOKEN_NAME = 'development-token'

export const tokenName =
  process.env.NEXT_PUBLIC_TOKEN_NAME ||
  tokenNames[apiDomain] ||
  DEFAULT_TOKEN_NAME

export default currentConfig
