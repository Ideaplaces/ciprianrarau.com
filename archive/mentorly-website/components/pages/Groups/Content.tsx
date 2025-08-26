import gql from 'graphql-tag'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import {
  GroupContentFieldsFragment,
  GroupFileFieldsFragmentDoc,
  GroupStylesFieldsFragmentDoc,
  Maybe,
  PartnerImageFieldsFragmentDoc,
} from 'types/graphql'

import PartnerImages from './PartnerImages'

gql`
  fragment GroupContentFields on Group {
    aboutTitle
    aboutSubtitle
    aboutText
    htmlAboutText: aboutText(format: "html")
    partnerLogoImages {
      ...PartnerImageFields
    }
    partnerHeader
    styles {
      ...GroupStylesFields
    }
    title
    subtitle
  }
  fragment ManagedGroupContentFields on ManagedGroup {
    aboutTitle
    aboutSubtitle
    aboutText
    htmlAboutText: aboutText(format: "html")
    partnerLogoImages {
      ...PartnerImageFields
    }
    partnerHeader
    styles {
      ...GroupStylesFields
    }
    title
    subtitle
  }
  ${GroupFileFieldsFragmentDoc}
  ${GroupStylesFieldsFragmentDoc}
  ${PartnerImageFieldsFragmentDoc}
`

type ContentProps = {
  group?: Maybe<GroupContentFieldsFragment>
  loading: boolean
}

const Content: VFC<ContentProps> = ({ group, loading }) => {
  const { formatMessage } = useIntl()

  const { aboutTitle, aboutSubtitle, htmlAboutText } = group || {}
  return (
    <section className="my-0 wrapper pb-8">
      <div className="mx-auto container flex flex-col">
        <div id="program-info" className="w-auto flex-grow mb-10 pr-0">
          <div
            className="inline-block mb-8"
            style={{
              borderBottom: `6px solid ${
                group?.styles?.backgroundColor || '#fdde35'
              }`,
            }}
          >
            <div className="text-sm font-bold tracking-widest uppercase">
              {loading ? (
                <Skeleton />
              ) : (
                aboutTitle || formatMessage({ id: 'group.about' })
              )}
            </div>
          </div>
          {loading ? (
            <Skeleton />
          ) : (
            aboutSubtitle && (
              <div className="text-3xl font-bold mb-2">{aboutSubtitle}</div>
            )
          )}
          <div
            className="rich-text"
            dangerouslySetInnerHTML={{ __html: htmlAboutText || '' }}
          />
        </div>
        {group?.partnerLogoImages && group?.partnerLogoImages?.length > 0 && (
          <aside className="w-auto my-0 pl-0 mb-4 text-left">
            <div className="text-sm font-bold mb-4">
              {group.partnerHeader ||
                formatMessage({ id: 'group.ourPartners' })}
            </div>
            <div className="items-center flex-wrap justify-start">
              <PartnerImages
                partnerLogoImages={group.partnerLogoImages}
                loading={loading}
              />
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

export default Content
