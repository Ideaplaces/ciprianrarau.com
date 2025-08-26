import classNames from 'classnames'
import Image from 'components/pages/Groups/Image'
import TitleImage from 'components/pages/Groups/TitleImage'
import { gql } from 'graphql-tag'
import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  GroupHeroFieldsFragment,
  GroupStylesFieldsFragmentDoc,
  Maybe,
} from 'types/graphql'

import styles from './hero.module.scss'
import HeroCTAButton from './HeroCTAButton'

gql`
  fragment GroupHeroImageFields on GroupFile {
    id
    fileUrl
    url
  }
  fragment ManagedGroupHeroFields on ManagedGroup {
    name
    logoImage {
      ...GroupHeroImageFields
      imageUrl(height: 128, width: 192)
    }
    backgroundImages {
      ...GroupHeroImageFields
      imageUrl(width: 1000)
    }
    pageLogoImage {
      ...GroupHeroImageFields
      imageUrl(height: 128, width: 192)
    }
    title
    subtitle
    styles {
      ...GroupStylesFields
    }
  }
  fragment GroupHeroFields on Group {
    name
    logoImage {
      ...GroupHeroImageFields
      imageUrl(height: 128, width: 192)
    }
    backgroundImages {
      ...GroupHeroImageFields
      imageUrl(width: 1000)
    }
    pageLogoImage {
      ...GroupHeroImageFields
      imageUrl(height: 128, width: 192)
    }
    title
    subtitle
    styles {
      ...GroupStylesFields
    }
  }
  ${GroupStylesFieldsFragmentDoc}
`

export type GroupProp = {
  group?: Maybe<GroupHeroFieldsFragment>
  loading?: boolean
}

const Hero: FC<GroupProp> = ({ group, loading }) => {
  // @TODO: use LogoSelect instead of GroupLogo, for DRYer code
  if (!group && !loading) {
    console.error('no group')
    return null
  }

  return (
    <section className="wrapper pt-6 pb-12 sm:pt-12 sm:pb-16">
      <div className="mx-auto container flex flex-col-reverse md:flex-row items-center">
        <div
          id="hero-text"
          className="w-full md:w-1/2 lg:w-2/5 pr-0 md:pr-8 pt-6 md:pt-0 flex flex-col sm:flex-row-reverse md:flex-col items-center"
        >
          <div className="w-full flex-0 sm:w-2/5 md:w-full justify-center text-left sm:text-center md:text-left">
            <HeroGroupLogo group={group} loading={loading} />
          </div>
          <div className="w-full flex-0 sm:w-3/5 sm:pr-8 md:pr-0 md:w-full items-center my-auto">
            <ProgramTitle group={group} loading={loading} />
            <ProgramDescription group={group} loading={loading} />
            <HeroCTAButton group={group} loading={loading} />
          </div>
        </div>
        <div
          id="hero-banner"
          className={classNames(
            'relative w-full md:w-1/2 lg:w-3/5 pb-1/2 md:pb-0',
            styles.titleImage
          )}
        >
          <TitleImage group={group} loading={loading} />
        </div>
      </div>
    </section>
  )
}

const ProgramTitle: FC<GroupProp> = ({ group, loading }) => (
  <div
    style={{ fontFamily: group?.styles?.titleFontName || undefined }}
    className={classNames('flex-0 pb-4 font-bold text-2xl', styles.title)}
  >
    {loading ? <Skeleton height={40} /> : group?.title}
  </div>
)

const ProgramDescription: FC<GroupProp> = ({ group, loading }) => (
  <div
    className={classNames(
      'flex-1 mb-8 sm:mb-6 w-full lg:mb-8 text-lg',
      styles.subtitle
    )}
  >
    {loading ? <Skeleton height={40} /> : group?.subtitle}
  </div>
)

const HeroGroupLogo: FC<GroupProp> = ({ group, loading }) => {
  if (
    !loading &&
    !group?.pageLogoImage?.imageUrl &&
    !group?.logoImage?.imageUrl
  ) {
    return <h1 className="text-4xl font-black pb-6 flex-0">{group?.name}</h1>
  }

  return (
    <div className="pb-6 flex-0 max-h-24">
      {loading && !group ? (
        <Skeleton height={80} width="100%" />
      ) : (
        <Image
          src={group?.pageLogoImage?.imageUrl || group?.logoImage?.imageUrl}
          alt=""
          className="relative mx-0 sm:mx-auto md:mx-0 h-auto lg:max-h-20 max-h-16"
        />
      )}
    </div>
  )
}

export default Hero
