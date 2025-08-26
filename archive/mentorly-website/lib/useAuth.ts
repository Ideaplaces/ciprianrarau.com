import { useApolloClient } from '@apollo/client'
import cookie from 'js-cookie'
import { Maybe } from 'types/graphql'

import { tokenName } from './env'
import doLogin from './login'
import doLogout from './logout'

export const getAuthToken = () => {
  return cookie.get(tokenName)
}

const useAuth = () => {
  const client = useApolloClient()

  const login = async (token?: string, domain?: Maybe<string>) => {
    doLogin(token, domain)
    await client.resetStore()
  }

  const logout = async (domain?: Maybe<string>) => {
    doLogout(domain)
    await client.resetStore()
  }

  return { login, logout }
}

export default useAuth
