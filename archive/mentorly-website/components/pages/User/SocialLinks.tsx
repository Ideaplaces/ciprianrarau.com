import { gql } from '@apollo/client'
import { SocialIcon } from 'components/icons/SocialIcon'
import { VFC } from 'react'
import { SocialLinksFieldsFragment } from 'types/graphql'

gql`
  fragment SocialLinksFields on SocialLink {
    url
    type
  }
`

type SocialLinksProps = {
  list: SocialLinksFieldsFragment[]
}

const SocialLinks: VFC<SocialLinksProps> = ({ list }) => {
  return (
    <>
      {list.map((link) => {
        const { url, type } = link

        if (!url || url === '') return null

        const parsedType = type.replace('_link', '')
        return (
          <a href={url} target="_blank" key={parsedType} rel="noreferrer">
            <SocialIcon type={parsedType} size={18} />
          </a>
        )
      })}
    </>
  )
}

export default SocialLinks
