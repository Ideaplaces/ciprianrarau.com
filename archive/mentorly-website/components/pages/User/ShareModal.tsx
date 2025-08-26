import CopyToClipboard from 'components/CopyToClipboard/CopyToClipboard'
import { H3 } from 'components/Headings'
import { SocialIcon } from 'components/icons/SocialIcon'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

type ShareModalProps = {
  title: string
  url: string
  isPrivate?: boolean
}

const ShareModal: VFC<ShareModalProps> = ({
  title,
  url,
  isPrivate = false,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="p-12">
      <H3>{title}</H3>
      <div className="flex flex-col py-6 space-y-4 items-start">
        {!isPrivate && (
          <>
            <SocialShareLink service="facebook" url={url} />
            <SocialShareLink service="linkedin" url={url} />
            <SocialShareLink service="twitter" url={url} />
          </>
        )}

        <CopyToClipboard string={url} size={32} className="space-x-4">
          <p className="ml-4">{formatMessage({ id: 'tooltip.copyLink' })}</p>
        </CopyToClipboard>
      </div>
    </div>
  )
}

type SocialShareLinkProps = {
  service: 'facebook' | 'twitter' | 'linkedin'
  url: string
}

const SocialShareLink: VFC<SocialShareLinkProps> = ({ service, url }) => {
  const { formatMessage } = useIntl()
  const text = formatMessage({ id: 'user.shareText' })
  const path = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}%3A%20${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
  return (
    <a
      href={path[service]}
      target="_blank"
      rel="noreferrer"
      className="inline-block"
    >
      <span className="flex justify-start space-x-4 items-center">
        <SocialIcon type={service} size={32} />
        <p>
          {formatMessage({ id: 'user.shareOn' })}&nbsp;
          <span className="capitalize">{service}</span>
        </p>
      </span>
    </a>
  )
}

export default ShareModal
