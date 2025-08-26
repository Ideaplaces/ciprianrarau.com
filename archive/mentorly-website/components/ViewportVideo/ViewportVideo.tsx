import { useEffect, useRef, VFC } from 'react'
import { useInView } from 'react-intersection-observer'

interface ViewportVideoProps {
  src: string
  className?: string
}

/**
 * ViewportVideo Component
 *
 * A video component that automatically plays when in viewport and pauses when out of viewport.
 * Video is always muted for autoplay compatibility.
 *
 * @param src - The video source path (relative or absolute)
 * @param className - Optional CSS classes for styling
 */
export const ViewportVideo: VFC<ViewportVideoProps> = ({
  src,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (inView) {
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error)
      })
    } else {
      video.pause()
    }
  }, [inView])

  return (
    <div ref={ref} className={className}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '12px',
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}

export default ViewportVideo
