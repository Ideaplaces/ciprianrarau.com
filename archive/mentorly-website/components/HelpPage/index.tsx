import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import { Image } from 'components/Image'
import React from 'react'
import { ExternalLink } from 'react-feather'
import { useIntl } from 'react-intl'
import { PageLayoutProps } from 'types/layout'

export type CProps = {
  href?: string
  title?: string
  subtitle?: string
  slug?: string
  type?: 'member' | 'manager'
}

type CollectionProps = PageLayoutProps & {
  collectionList?: CProps[]
  collection?: CProps
}

const HelpPageLayout = ({
  collectionList: collections,
}: CollectionProps): JSX.Element => {
  const Collection = ({ collection }: CollectionProps) => {
    return (
      <a
        className="bg-white mb-4 flex items-center flex-col"
        href={collection?.href}
        target="_blank"
        rel="noreferrer"
      >
        <div className="px-8 w-64">
          <Image
            src={`${
              collection?.type === 'member'
                ? '/images/help/pMember.png'
                : '/images/help/pManager.png'
            }`}
            alt={collection?.title || 'member'}
            className="img"
          />
        </div>
        <div className="py-6">
          <div className="text-xl font-black">{collection?.title}</div>
          {collection?.subtitle && (
            <div className="my-2">{collection.subtitle}</div>
          )}
          <small className="text-blue font-medium text-sm flexbox-basis">
            <ExternalLink className="mr-2" size={16} />
            {formatMessage({ id: 'section.helpViewResources' })}
          </small>
        </div>
      </a>
    )
  }

  const { formatMessage } = useIntl()

  if (!collections) {
    return (
      <div className="bg-white p-8 h-full items-start">
        {formatMessage({ id: 'feature.coming_soon' })}
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-10 flex-col flex">
      <Heading>
        <h1 className="font-black text-2xl pt-4 pb-2">
          {formatMessage({ id: 'header.helpAndResources' })}
        </h1>
      </Heading>
      <section className="p-10 bg-white w-full fillHeight mb-4 text-center">
        <h2 className="my-4 font-bold text-xl">
          {formatMessage({ id: 'section.help' })}
        </h2>
        <div className="flexbox-basis">
          {collections?.map((collection: CProps) => (
            <Collection key={collection.title} collection={collection} />
          ))}
        </div>
        <div className="mt-10">
          <p>{formatMessage({ id: 'section.helpFooter' })}</p>
          <button
            onClick={() =>
              process.env.NODE_ENV !== 'production'
                ? alert('this button only works in production')
                : undefined
            }
            id="custom_intercom_button"
            className="bg-black rounded-full px-8 py-2 text-white inline-block mt-5 text-sm"
          >
            {formatMessage({ id: 'button.goToLiveChat' })}
          </button>
        </div>
      </section>
    </div>
  )
}

HelpPageLayout.Layout = DashboardLayout
export default HelpPageLayout
