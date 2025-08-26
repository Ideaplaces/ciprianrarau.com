import { gql } from '@apollo/client'
import Header from 'components/Header/Header'
import Content from 'components/pages/Groups/Content'
import Hero from 'components/pages/Groups/Hero'
import { groupFonts } from 'components/pages/Groups/MetaHeader'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC } from 'react'
import {
  GroupEssentialsFieldsFragment,
  ManagedGroupContentFieldsFragmentDoc,
  ManagedGroupHeroFieldsFragmentDoc,
  Maybe,
  PortalPreviewFieldsFragment,
} from 'types/graphql'

import styles from './design.module.scss'

// @TODO: problem here is that the form in Design doesn't use all these fields
// i.e. name, backgroundImage, partnerLogoImages are not set here
// ... but why not?

gql`
  fragment PortalPreviewFields on ManagedGroup {
    ...ManagedGroupHeroFields
    ...ManagedGroupContentFields
  }
  ${ManagedGroupHeroFieldsFragmentDoc}
  ${ManagedGroupContentFieldsFragmentDoc}
`

export type PreviewValuesType = Omit<
  PortalPreviewFieldsFragment,
  'id' | 'name' | 'backgroundImages' | 'partnerLogoImages'
>

type PortalPreviewerProps = {
  previewValues?: Maybe<PreviewValuesType>
  loading: boolean
}

const PortalPreviewer: FC<PortalPreviewerProps> = ({
  previewValues,
  loading,
}) => {
  const { currentGroup } = useCurrentGroup()
  const groupContent = {
    ...currentGroup,
    ...previewValues,
  } as GroupEssentialsFieldsFragment
  return (
    <div
      className={styles.clientPortalPreview}
      style={{ fontFamily: groupContent?.styles?.fontName || undefined }}
    >
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?${groupFonts(
          groupContent
        )}&display=swap`}
      />
      <Header isPreview group={groupContent} />
      <Hero group={groupContent} loading={loading} />
      <Content group={groupContent} loading={loading} />
    </div>
  )
}

export default PortalPreviewer
