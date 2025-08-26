import { captureMessage } from '@sentry/browser'
import { has } from 'lodash'
import { FC, useEffect } from 'react'
import { Maybe } from 'types/graphql'

const DOMAIN = '8x8.vc' // 'meet.jit.si'

const toolbarButtons = [
  'microphone',
  'camera',
  'closedcaptions',
  'desktop',
  // 'embedmeeting',
  'fullscreen',
  // 'fodeviceselection',
  'hangup',
  // 'profile',
  // 'chat',
  'recording',
  // 'livestreaming',
  // 'etherpad',
  'sharedvideo',
  'shareaudio',
  'settings',
  'raisehand',
  'videoquality',
  'filmstrip',
  // 'feedback',
  // 'stats',
  // 'shortcuts',
  'tileview',
  'select-background',
  // 'download',
  // 'help',
  // 'mute-everyone',
  // 'mute-video-everyone',
  // 'security',
]

const useScript = (url: string, onload: any) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.onload = onload
    script.onerror = () => {
      console.warn(`Failed to load script at ${url}`)
      captureMessage(`Failed to load script at ${url}`)
    }
    script.src = url
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])
}

type JitsiProps = {
  roomName?: Maybe<string>
  conferenceId: string
  subject?: string
  jwt: string
  onReadyToClose: () => void
  isAdmin: boolean
}

const Jitsi: FC<JitsiProps> = ({
  roomName,
  conferenceId,
  subject,
  jwt,
  onReadyToClose,
  isAdmin,
}) => {
  useScript(`https://${DOMAIN}/external_api.js`, () => {
    const api = new (window as any).JitsiMeetExternalAPI(DOMAIN, {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#meet'),
      configOverwrite: {
        prejoinPageEnabled: false,
        brandingRoomAlias: conferenceId,
        defaultLanguage: 'en',
        enableWelcomePage: false,
        subject: subject,
      },
      interfaceConfigOverwrite: {
        HIDE_INVITE_MORE_HEADER: true,
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: isAdmin
          ? [...toolbarButtons, 'mute-everyone', 'mute-video-everyone']
          : toolbarButtons,
      },
      jwt,
    })

    api.addListener('errorOccurred', (error: unknown) => {
      console.warn('Jitsi error', error)
      if (has(error, 'message')) {
        captureMessage(`Jitsi error: ${(error as { message: string }).message}`)
      }
    })

    api.addListener('readyToClose', () => {
      console.warn('readyToClose')
      if (onReadyToClose) {
        onReadyToClose()
      }
    })

    api.addListener('videoConferenceLeft', () => {
      console.warn('videoConferenceLeft')
    })
  })

  return <div className="bg-black h-full w-full" id="meet"></div>
}

export default Jitsi
