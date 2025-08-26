import { useRouter } from 'lib/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

const useCheckDirty = () => {
  const router = useRouter()
  const [unsaved, setUnsaved] = useState(false)
  const { formatMessage } = useIntl()

  useEffect(() => {
    const warningText = formatMessage({ id: 'confirm.leaveDirty' })

    const handleWindowClose = (e: any) => {
      if (!unsaved) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }

    const handleBrowseAway = () => {
      if (!unsaved) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError', '', '', { shallow: false })
      throw 'routeChange cancelled'
    }

    const unsetListener = () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }

    const setListener = () => {
      window.addEventListener('beforeunload', handleWindowClose)
      router.events.on('routeChangeStart', handleBrowseAway)
    }

    unsaved ? setListener() : unsetListener()

    return () => unsetListener()
  }, [unsaved])

  return { setUnsaved, unsaved }
}

export { useCheckDirty }
