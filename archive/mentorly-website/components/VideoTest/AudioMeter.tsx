import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
} from 'react'

const AudioMeter = (
  props: DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const volume = useRef(0)
  const averaging = 0.95

  const process = (event: any) => {
    try {
      if (!canvasRef.current) {
        return null
      }

      const canvasCtx = canvasRef.current.getContext('2d')

      if (!canvasCtx) {
        return null
      }

      const buf = event.inputBuffer.getChannelData(0)
      let sum = 0
      let x

      for (let i = 0; i < buf.length; i++) {
        x = buf[i]
        sum += x * x
      }

      const rms = Math.sqrt(sum / buf.length)
      volume.current = Math.max(rms, volume.current * averaging)

      canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
      canvasCtx.fillRect(
        0,
        0,
        canvasCtx.canvas.width * (volume.current + 0.01),
        canvasCtx.canvas.height
      )
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    try {
      // Init processing.
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // @ts-expect-error: window probably needs to be typed as ts thinks webkitAudioContext doesn't exist
          window.AudioContext = window.AudioContext || window.webkitAudioContext
          const audioCtx = new AudioContext()
          const source = audioCtx.createMediaStreamSource(stream)
          const processor = audioCtx.createScriptProcessor(256)
          const canvasCtx = canvasRef?.current?.getContext('2d')

          if (canvasCtx) canvasCtx.fillStyle = '#00FF48'

          processor.onaudioprocess = process
          processor.connect(audioCtx.destination)
          source.connect(processor)
        })
        .catch(function (err) {
          alert(
            'Error occurred while initalizing audio input: ' + err.toString()
          )
        })
    } catch (ex) {
      console.error(ex)
    }
  }, [])

  return <canvas ref={canvasRef} {...props} />
}

export default AudioMeter
