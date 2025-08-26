import isAbsoluteUrl from 'is-absolute-url'
import { useRouter } from 'lib/router'
import { useEffect, VFC } from 'react'

type RedirectProps = {
  url: string
}

const Redirect: VFC<RedirectProps> = ({ url }) => {
  const router = useRouter()

  useEffect(() => {
    if (url) {
      if (isAbsoluteUrl(url)) {
        window.location.href = url
      } else {
        router.push(url)
      }
    }
  }, [url])

  return null
}

export default Redirect
