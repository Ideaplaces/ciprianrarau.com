import isIE from '@braintree/browser-detection/is-ie'
import { useEffect, useState } from 'react'

const useIsIE = () => {
  const [result, setResult] = useState(false)

  useEffect(() => {
    if (isIE()) {
      setResult(true)
    }
  }, [])

  return result
}

export default useIsIE
