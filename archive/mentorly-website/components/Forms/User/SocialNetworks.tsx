import Field from 'components/controls/Field'
import gql from 'graphql-tag'
import { capitalize } from 'lodash'
import { VFC } from 'react'

gql`
  fragment SocialNetworksFields on CurrentUser {
    behanceLink
    dribbbleLink
    facebookLink
    instagramLink
    linkedinLink
    twitterLink
    vimeoLink
    youtubeLink
  }
`

const socialNetworks = [
  'behance',
  'dribbble',
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'vimeo',
  'youtube',
]

const SocialNetworks: VFC = () => (
  <div className="flex flex-wrap">
    {socialNetworks.map((network) => (
      <Field
        className="w-1/2 odd:pr-4 pr-4"
        placeholder={`www.${network.toLowerCase()}.com`}
        key={network}
        label={capitalize(network)}
        name={network + 'Link'}
        isSocialURL
        strip
      />
    ))}
  </div>
)

export default SocialNetworks
