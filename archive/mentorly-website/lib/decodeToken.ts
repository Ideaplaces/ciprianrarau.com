import { atob } from 'lib/atob'

type ParsedToken = {
  token?: string
  email?: string
}

const decodeToken = (value?: string): ParsedToken => {
  if (!value) {
    return { token: undefined, email: undefined }
  }

  const [token, email] = value.split(':')

  if (!email) {
    return {
      token,
      email: '',
    }
  }

  return {
    token,
    email:
      atob(email.replace(/-/g, '+').replace(/_/g, '/').replace(/>/g, '')) || '',
  }
}

export default decodeToken
