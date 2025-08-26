import Spinner from 'components/feedback/Spinner'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import AudioMeter from './AudioMeter'

export const errorMessage = (err: { name: string }) => {
  if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    return 'conference.error.notFoundError'
  }

  if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
    return 'conference.error.notReadableError'
  }

  if (
    err.name === 'OverconstrainedError' ||
    err.name === 'ConstraintNotSatisfiedError'
  ) {
    return 'conference.error.overconstrainedError'
  }

  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    return 'conference.error.notAllowedError'
  }

  if (err.name === 'TypeError' || err.name === 'TypeError') {
    return 'conference.error.typeErrorError'
  }

  return err.name
}

const checkVideo = async () => {
  try {
    const constraints = {
      audio: true,
      video: true,
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)

    const videoTracks = stream.getVideoTracks()
    const audioTracks = stream.getAudioTracks()

    return {
      stream,
      error: false,
      videoDevice: videoTracks[0].label,
      audioDevice: audioTracks[0].label,
      message: 'conference.connected',
    }
  } catch (error: unknown) {
    const message = errorMessage(error as { name: string })
    return {
      error,
      message,
    }
  }
}

const VideoTest = () => {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const [stream, setStream] = useState(null)
  const [audioDevice, setAudioDevice] = useState('')
  const [videoDevice, setVideoDevice] = useState('')
  const [networkQuality, setNetworkQuality] = useState('')
  const { formatMessage } = useIntl()

  useEffect(() => {
    checkVideo().then((result: any) => {
      setStream(result.stream)
      setVideoDevice(result.videoDevice)
      setAudioDevice(result.audioDevice)
      setMessage(result.message)
      result.error && setError(result.error)
    })
    // @ts-expect-error: current property of effectiveType doesn't exist?
    setNetworkQuality(navigator?.connection?.effectiveType)
  }, [])

  const renderNetworkQuality = () => {
    if (networkQuality === '4g')
      return (
        <div className="bg-green text-white m-5 p-2 flex justify-center">
          {formatMessage({ id: 'conference.goodNetwork' })}
        </div>
      )
    if (networkQuality === '3g')
      return (
        <div className="bg-primary text-white m-5 p-2 flex justify-center">
          {formatMessage({ id: 'conference.mediumNetwork' })}
        </div>
      )
    return (
      <div className="bg-red text-white m-5 p-2 flex justify-center">
        {formatMessage({ id: 'conference.badNetwork' })}
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full flex justify-center m-32 flex-col">
        <div>
          <h2 className="text-red">Error</h2>
        </div>
        {message && <p>{formatMessage({ id: message })}</p>}
      </div>
    )
  }

  if (stream) {
    return (
      <div className="w-full flex justify-center m-auto ">
        <div className="flex flex-col m-32">
          <video
            className="w-80 m-5"
            muted
            ref={(video) => {
              if (video) {
                video.srcObject = stream
                video.play()
              }
            }}
          />
          <div>
            <b>video</b>: {videoDevice}
            <div>
              <b>audio</b>: {audioDevice}
            </div>
            <AudioMeter width="320" height="10" />
          </div>
          {networkQuality && renderNetworkQuality()}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center mt-20">
      <Spinner />
    </div>
  )
}

export default VideoTest
