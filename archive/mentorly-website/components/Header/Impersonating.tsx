import { storageAvailable } from 'lib/featureDetection'
import { useEffect, useState } from 'react'

const impersonateUserId = () => {
  if (!storageAvailable('localStorage')) {
    return null
  }

  if (localStorage.getItem('impersonateUserId') !== null) {
    return localStorage.getItem('impersonateUserId')
  }

  return null
}

const Impersonating = () => {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setUserId(impersonateUserId())
  })

  const cancel = () => {
    localStorage.removeItem('impersonateUserId')
    location.reload()
    return false
  }

  if (!userId) {
    return null
  }

  return (
    <div className="mr-4 text-xs">
      <div>Impersonating user #{userId}</div>
      <button className="font-bold" onClick={cancel}>
        Cancel
      </button>
    </div>
  )
}

export default Impersonating
