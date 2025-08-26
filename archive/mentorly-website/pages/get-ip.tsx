import Head from 'next/head'
import { useEffect, useState } from 'react'

// This is a PUBLIC page - no authentication required
// Team members can access this without logging in

interface IPInfo {
  ip: string
  city?: string
  region?: string
  country?: string
  org?: string
}

const GetMyIP = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchIPInfo()
  }, [])

  const fetchIPInfo = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json')
      const data = await response.json()
      setIpInfo(data)
    } catch (_error) {
      setIpInfo({ ip: 'Unable to detect' })
    } finally {
      setLoading(false)
    }
  }

  const copyIP = async () => {
    if (!ipInfo?.ip) return

    try {
      await navigator.clipboard.writeText(ipInfo.ip)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = ipInfo.ip
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Head>
        <title>Get My IP Address - Mentorly Team</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Public tool for Mentorly team members to get their IP address for analytics exclusion"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🔍 Get My IP Address
            </h1>
            <p className="text-gray-600 text-sm">
              For Mentorly team members to exclude from analytics
            </p>
            <p className="text-xs text-green-600 mt-1">
              ✅ Public access - no login required
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Detecting your IP...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="block text-sm font-medium text-blue-900 mb-2">
                  Your IP Address:
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white px-4 py-2 rounded-lg border flex-1">
                    <code className="text-lg font-mono text-blue-800">
                      {ipInfo?.ip}
                    </code>
                  </div>
                  <button
                    onClick={copyIP}
                    disabled={!ipInfo?.ip || ipInfo.ip === 'Unable to detect'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      copied
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {ipInfo?.city && (
                <div className="text-sm text-gray-600 text-center bg-gray-50 rounded-lg py-2">
                  📍 {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                </div>
              )}

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">
                  📋 Next Steps:
                </h3>
                <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Copy your IP address above</li>
                  <li>Send it to Chip in Slack/Teams</li>
                  <li>Include your name for reference</li>
                  <li>
                    That&apos;s it! You&apos;ll be excluded from analytics
                  </li>
                </ol>
              </div>

              <div className="text-center">
                <button
                  onClick={fetchIPInfo}
                  className="text-blue-500 hover:text-blue-700 text-sm underline transition-colors"
                >
                  🔄 Refresh IP Address
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-xs">
                  <strong>Why exclude from analytics?</strong>
                  <br />
                  This prevents internal team browsing from affecting user
                  analytics data, ensuring more accurate insights about real
                  customer behavior.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 text-center border-t pt-4">
            🔒 This is a public tool for internal team use only
            <br />
            No personal data is stored or transmitted
          </div>
        </div>
      </div>
    </>
  )
}

// Explicitly export for public access
export default GetMyIP

// This page is intentionally public and requires no authentication
