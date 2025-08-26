import { gql } from '@apollo/client'
import classNames from 'classnames'
import { VFC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { PartnerImageFieldsFragment } from 'types/graphql'

import styles from './content.module.scss'
import Image from './Image'

// @TODO: could this just be a single group image component?
// shouldn't have to be specific to partnerLogos
// we could just pass the specific props for each use case (i.e. styles.partnerLogos)

gql`
  fragment PartnerImageFields on GroupFile {
    id
    position
    imageUrl(height: 128, width: 192)
    fileUrl
    url
  }
`

type PartnerImageProps = {
  details?: PartnerImageFieldsFragment
}

const PartnerImage: VFC<PartnerImageProps> = ({ details }) => (
  <Image
    className={classNames('mb-3 my-0 mr-8 inline-block', styles.partnerLogos)}
    src={details?.imageUrl}
    alt=""
  />
)

type PartnerImagesProps = {
  partnerLogoImages: PartnerImageFieldsFragment[]
  loading: boolean
}

const PartnerImages: VFC<PartnerImagesProps> = ({
  partnerLogoImages,
  loading,
}) =>
  loading ? (
    <Skeleton height="128" width="192" />
  ) : (
    <>
      {partnerLogoImages.map((logoImage) =>
        logoImage.url ? (
          <a
            href={logoImage.url}
            key={logoImage.id}
            target="_blank"
            rel="noreferrer"
          >
            <PartnerImage details={logoImage} />
          </a>
        ) : (
          <PartnerImage key={logoImage.id} details={logoImage} />
        )
      )}
    </>
  )

export default PartnerImages
