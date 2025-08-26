import classNames from 'classnames'
import {
  Facebook,
  Instagram,
  LinkedIn,
  TikTok,
  X,
} from 'components/icons/SocialIcon'
import { VFC } from 'react'

export type SocialLinksProps = {
  className?: string
}

const SocialLinks: VFC<SocialLinksProps> = ({ className }) => {
  return (
    <div className={classNames('flex justify-center sm:space-x-2', className)}>
      <a
        href="https://www.facebook.com/mentorly"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook size={20} className="hidden sm:block" />
        <Facebook size={60} className="sm:hidden block mr-6" />
      </a>
      <a
        href="https://instagram.com/mentorlyofficial"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram size={20} className="hidden sm:block" />
        <Instagram size={60} className="sm:hidden block" />
      </a>
      <a
        href="https://linkedin.com/company/mentorly"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedIn size={20} className="hidden sm:block" />
        <LinkedIn size={60} className="sm:hidden block" />
      </a>
      <a
        href="https://twitter.com/InfoMentorly"
        target="_blank"
        rel="noopener noreferrer"
      >
        <X size={20} className="hidden sm:block" />
        <X size={60} className="sm:hidden block" />
      </a>
      <a
        href="https://www.tiktok.com/@mentorlyofficial/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TikTok size={20} className="hidden sm:block" />
        <TikTok size={60} className="sm:hidden block" />
      </a>
    </div>
  )
}

export default SocialLinks
