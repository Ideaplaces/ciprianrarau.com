import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

import styles from './Video.module.scss'

const vimeoRegex = /vimeo\.com\/(.*)/
const youtubeRegex1 = /youtu\.be\/(.*)/
const youtubeRegex2 = /youtube\.com\/watch\?v=(.*)/

const VIDEOS: Record<string, Record<string, string>> = {
  b2b: {
    en: '1087232894',
    fr: '1087232894',
  },
  b2c: {
    en: '463160850',
    fr: '552948916',
  },
}

const embedUrl = (url: Maybe<string | undefined>, fallbackId: string) => {
  const vimeoMatches = url && url.match(vimeoRegex)
  const youtubeMatches =
    url && (url.match(youtubeRegex1) || url.match(youtubeRegex2))

  let id = fallbackId

  if (vimeoMatches) {
    id = vimeoMatches[1]
    return `https://player.vimeo.com/video/${id}`
  }
  if (youtubeMatches) {
    id = youtubeMatches[1]
    return `https://www.youtube.com/embed/${id}`
  } else {
    return `https://player.vimeo.com/video/${id}`
  }
}

type VideoProps = {
  url?: string
  category?: string
}

const Video: VFC<VideoProps> = ({ url, category = 'b2b' }) => {
  const { locale } = useIntl()

  const playerUrl = embedUrl(url, VIDEOS[category][locale])

  return (
    <div className={styles.aspect}>
      <iframe
        title="Video player"
        src={playerUrl}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default Video
