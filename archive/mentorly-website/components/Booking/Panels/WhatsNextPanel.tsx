import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { groupUserPermissionsForForm } from 'lib/userFormPermissions'
import { FC } from 'react'
import { useIntl } from 'react-intl'

export type WhatsNextPanelProps = {
  mentorName?: string
}

const WhatsNextPanel: FC<WhatsNextPanelProps> = ({ mentorName }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { hasReadOnly: profileLimited } = groupUserPermissionsForForm(
    currentGroup,
    currentUser,
    'userProfile'
  )

  return (
    <div className="w-auto md:w-6/12 pl-7 z-10 bg-none">
      <h2 className="font-black text-lg mb-4">
        {formatMessage({ id: 'header.whatsNext' })}
      </h2>
      <h3 className="font-black text-md">
        {formatMessage({ id: 'tooltip.prepareYourSession' })}
      </h3>
      <ol className="list-decimal ml-4">
        <li>
          <a
            className="text-highlightColor font-bold"
            href={`https://intercom.help/mentorly/${
              locale === 'fr'
                ? 'fr/articles/6542188-comment-preparer-un-agenda-pour-vos-seances'
                : 'en/articles/6542188-setting-an-agenda-for-your-session'
            } `}
            target="_blank"
            rel="noreferrer"
          >
            {formatMessage({ id: 'text.makeAgenda' })}
          </a>{' '}
          {formatMessage(
            { id: 'text.coverWith' },
            { firstName: mentorName || formatMessage({ id: 'term.mentor' }) }
          )}
        </li>
        {!profileLimited && (
          <li>
            <a
              href={`/${locale}/personal/profile`}
              target="_blank"
              rel="noreferrer"
              className="text-highlightColor font-bold"
            >
              {formatMessage({ id: 'text.finishCompletingProfile' })}
            </a>
          </li>
        )}
        <li>
          <a
            className="text-highlightColor font-bold"
            href="https://intercom.help/mentorly/en/collections/807636-program-member"
            target="_blank"
            rel="noreferrer"
          >
            {formatMessage({ id: 'text.readOurResources' })}
          </a>{' '}
          {formatMessage({ id: 'text.getMost' })}
        </li>
      </ol>
    </div>
  )
}

export default WhatsNextPanel
