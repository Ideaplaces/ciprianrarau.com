import { RefetchQueriesFunction } from '@apollo/client'
import Panel from 'components/display/Panel'
import Files from 'components/Forms/Files'
import { faviconTypesAllowed, supportedImages } from 'lib/fileTypesAllowed'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { GroupDesignQuery, Maybe } from 'types/graphql'

type GroupAssetsProps = {
  group: GroupDesignQuery['group']
  refetch: RefetchQueriesFunction
}

const GroupAssets: FC<GroupAssetsProps> = ({ group, refetch }) => {
  const { formatMessage } = useIntl()

  const groupStyles = (
    styles?: Maybe<{
      backgroundColor?: Maybe<string>
      backgroundTextColor?: Maybe<string>
    }>
  ) => {
    const { backgroundColor, backgroundTextColor } = styles || {}

    return {
      backgroundColor,
      color: backgroundTextColor,
    }
  }

  if (!group) {
    console.error('no group found')
    return null
  }

  return (
    <>
      {group.whiteLabel && (
        <Panel className="mb-4" style={groupStyles(group.styles)}>
          <Panel.Body>
            <h2 className="font-black my-4">
              {formatMessage({
                id: 'header.design.headerFooterLogo',
              })}
            </h2>
            <Files
              type="logo"
              data={group.logoImage || undefined}
              groupId={group.id}
              allowedFileTypes={supportedImages}
              refetch={refetch}
            />
          </Panel.Body>
        </Panel>
      )}
      <Panel className="mb-4">
        <Panel.Body>
          <h2 className="font-black my-4">
            {formatMessage({ id: 'header.design.pageLogo' })}
          </h2>
          <Files
            type="page_logo"
            data={group.pageLogoImage || undefined}
            groupId={group.id}
            allowedFileTypes={supportedImages}
            refetch={refetch}
          />
        </Panel.Body>
      </Panel>
      <Panel className="mb-4">
        <Panel.Body>
          <h2 className="font-black my-4">
            {formatMessage({ id: 'header.design.favicon' })}
          </h2>
          <Files
            type="favicon"
            data={group.files.find((f: any) => f.type === 'favicon') || []}
            maxDimension={300}
            maxFileSize={1 * 1024 * 1024}
            groupId={group.id}
            allowedFileTypes={faviconTypesAllowed}
            refetch={refetch}
          />
        </Panel.Body>
      </Panel>
      <Panel className="mb-4">
        <Panel.Body>
          <h2 className="font-black my-4">
            {formatMessage({
              id: 'header.design.defaultProfileImage',
            })}
          </h2>
          <Files
            type="defaultProfileImage"
            data={
              group.files.find((f: any) => f.type === 'defaultProfileImage') ||
              []
            }
            groupId={group.id}
            allowedFileTypes={supportedImages}
            refetch={refetch}
          />
        </Panel.Body>
      </Panel>
      <Panel className="mb-4">
        <Panel.Body>
          <h2 className="font-black my-4">
            {formatMessage({ id: 'header.design.bannerImages' })}
          </h2>

          <Files
            type="background"
            data={group.backgroundImages}
            groupId={group.id}
            allowedFileTypes={supportedImages}
            refetch={refetch}
            multiple
          />
        </Panel.Body>
      </Panel>
      <Panel>
        <Panel.Body>
          <h2 className="font-black my-4">
            {formatMessage({ id: 'header.design.partners' })}
          </h2>
          <Files
            type="partner_logo"
            data={group.partnerLogoImages}
            groupId={group.id}
            allowedFileTypes={supportedImages}
            refetch={refetch}
            multiple
            hasURL
          />
        </Panel.Body>
      </Panel>
    </>
  )
}

export default GroupAssets
