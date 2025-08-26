import { useRouter as useNextRouter } from 'next/router'

const fakeRouter = { isReady: false, asPath: '', query: {}, push: () => {} }

export const useRouter = () => {
  return useNextRouter() || fakeRouter
}
