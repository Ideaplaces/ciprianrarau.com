import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export default function absoluteUrl(
  req?: IncomingMessage & { cookies: NextApiRequestCookies },
  setLocalhost?: string
) {
  let protocol = 'https:'
  let host = req
    ? ((req.headers?.['x-forwarded-host'] || req.headers?.['host']) as string)
    : window.location.host

  if (host && host.indexOf('localhost') > -1) {
    if (setLocalhost) host = setLocalhost
    protocol = 'http:'
  }

  const [hostname, port] = host.split(':')

  return {
    host,
    hostname,
    origin: protocol + '//' + host,
    port: port || '',
    protocol,
  }
}
