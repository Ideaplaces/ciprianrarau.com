import { gql } from '@apollo/client'
import { VFC } from 'react'

gql`
  fragment FounderFields on TeamContent {
    name
    title
    imageUrl
  }
`
type FounderAvatarProps = {
  name?: string | null
  title?: string | null
  imageUrl?: string | null
}
const FounderAvatar: VFC<FounderAvatarProps> = ({ name, title, imageUrl }) => {
  return (
    <div className="md:w-1/2 flex mb-6">
      {imageUrl && (
        <img
          className="rounded-full w-24 h-24 md:w-32 md:h-32 flex-none"
          src={imageUrl}
          alt={name || 'avatar'}
        />
      )}
      <div className="w-2/3 ml-4">
        {name && <div className="font-black">{name}</div>}
        {title && <div>{title}</div>}
      </div>
    </div>
  )
}

export default FounderAvatar
