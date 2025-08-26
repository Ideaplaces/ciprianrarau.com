import { cloneElement, ReactElement, ReactText, VFC } from 'react'

import Behance from './Behance'
import Default from './Default'
import Dribbble from './Dribbble'
import Facebook from './Facebook'
import FacebookSquare from './FacebookSquare'
import GCal from './GCal'
import Google from './Google'
import GoogleSquare from './GoogleSquare'
import ICal from './ICal'
import Instagram from './Instagram'
import LinkedIn from './LinkedIn'
import LinkedInSquare from './LinkedInSquare'
import Microsoft from './Microsoft'
import Outlook from './Outlook'
import Teams from './Teams'
import TikTok from './TikTok'
import Twitter from './Twitter'
import Vimeo from './Vimeo'
import X from './X'
import Yahoo from './Yahoo'
import YouTube from './YouTube'
import Zoom from './Zoom'

type icon = Record<string, ReactElement>

const icons: icon = {
  default: <Default />,
  behance: <Behance />,
  dribbble: <Dribbble />,
  facebook: <Facebook />,
  teams: <Teams />,
  instagram: <Instagram />,
  linkedin: <LinkedIn />,
  twitter: <Twitter />,
  vimeo: <Vimeo />,
  youtube: <YouTube />,
  outlook: <Outlook />,
  google: <Google />,
  ical: <ICal />,
  googleSquare: <GoogleSquare />,
  facebookSquare: <FacebookSquare />,
  linkedInSquare: <LinkedInSquare />,
  microsoft: <Microsoft />,
  yahoo: <Yahoo />,
  zoom: <Zoom />,
  x: <X />,
  tikTok: <TikTok />,
}

export type SocialIconProps = {
  color?: string
  type: keyof icon
  size?: ReactText
  className?: string
}

const SocialIcon: VFC<SocialIconProps> = ({
  color = 'black',
  type,
  size = 18,
}) => {
  return cloneElement(icons[type] || icons['default'], { color, size })
}

export {
  Default,
  Behance,
  Dribbble,
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  Teams,
  Vimeo,
  YouTube,
  Outlook,
  GCal,
  ICal,
  SocialIcon,
  GoogleSquare,
  FacebookSquare,
  LinkedInSquare,
  Microsoft,
  Yahoo,
  Zoom,
  X,
  TikTok,
}

export default SocialIcon
