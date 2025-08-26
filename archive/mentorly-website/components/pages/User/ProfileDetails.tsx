import { gql } from '@apollo/client'
import ButtonRow from 'components/display/ButtonRow'
import InfoRow from 'components/display/InfoRow'
import Feature from 'components/Feature'
import Modal from 'components/Modal'
import ShareModal from 'components/pages/User/ShareModal'
import { useCurrentGroup } from 'lib/GroupContext'
import { parseUrl } from 'lib/urls'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  ProfileDetailsFieldsFragment,
  SocialLinksFieldsFragmentDoc,
} from 'types/graphql'

import MessageUser from './MessageUser'
import Panel from './Panel'
import SocialLinks from './SocialLinks'

gql`
  fragment ProfileDetailsFields on User {
    id
    name
    publicTagList
    role
    subdisciplines {
      name
    }
    experience
    languages {
      name
    }
    company
    skills
    description
    website
    socialLinks {
      ...SocialLinksFields
    }
  }
  ${SocialLinksFieldsFragmentDoc}
`

type ProfileDetailsProps = {
  member: ProfileDetailsFieldsFragment
  isMentor?: boolean
}

const ProfileDetails: VFC<ProfileDetailsProps> = ({ member, isMentor }) => {
  const { formatMessage } = useIntl()
  const { currentGroup }: any = useCurrentGroup()
  const [modalOpen, setModalOpen] = useState(false)

  const {
    id,
    name,
    publicTagList,
    role,
    subdisciplines,
    experience,
    languages,
    company,
    skills,
    description,
    website,
    socialLinks,
  } = member

  const firstName = name.split(' ')[0].trim()

  const groupName = currentGroup?.marketplace ? 'Mentorly' : currentGroup.name
  return (
    <Panel className="sm:flex-row sm:space-y-0 sm:space-x-14 space-y-12">
      <div className="w-full sm:w-7/12">
        <table>
          <tbody>
            {publicTagList && publicTagList.length > 0 && (
              <InfoRow label="term.tags">{publicTagList}</InfoRow>
            )}
            {role && <InfoRow label="term.role">{role}</InfoRow>}
            {subdisciplines.length > 0 && (
              <Feature id="userSubdisciplines">
                <InfoRow label="term.subdisciplines">
                  {subdisciplines.map((sub: any) => sub.name).join(', ')}
                </InfoRow>
              </Feature>
            )}
            {experience && (
              <Feature id="userExperience" group={currentGroup}>
                <InfoRow label="term.experience">
                  {experience} {formatMessage({ id: 'term.years' })}
                </InfoRow>
              </Feature>
            )}
            {languages && (
              <Feature id="userLanguages" group={currentGroup}>
                <InfoRow label={formatMessage({ id: 'user.languages' })}>
                  {languages.map((lang: any) => lang.name).join(', ')}
                </InfoRow>
              </Feature>
            )}
            {company && (
              <Feature id="userCompany">
                <InfoRow label="term.company">{company}</InfoRow>
              </Feature>
            )}
            {isMentor && skills && (
              <Feature id="userSkills" group={currentGroup}>
                <InfoRow label="term.skills">{skills}</InfoRow>
              </Feature>
            )}
          </tbody>
        </table>
        {description && (
          <Feature id="userDescription">
            <div className="mt-8">
              {!isMentor && (
                <h2 className="text-xl font-bold mb-4">
                  {formatMessage({ id: 'term.whyIJoined' }) + ' ' + groupName}
                </h2>
              )}
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </Feature>
        )}
      </div>
      <div className="w-full sm:w-5/12 divide-y divide-gray">
        {website && (
          <ButtonRow href={website} external newWindow>
            {parseUrl(website)}
          </ButtonRow>
        )}
        <Feature id="messaging">
          <MessageUser userId={id}>
            <ButtonRow>
              {formatMessage({ id: 'user.sendMessage' })}&nbsp;{name}
            </ButtonRow>
          </MessageUser>
        </Feature>
        <Feature id="userShare">
          <ButtonRow onClick={() => setModalOpen(true)}>
            {formatMessage({ id: 'button.shareProfile' })}
          </ButtonRow>
          <Modal open={modalOpen} close={() => setModalOpen(false)} width="sm">
            <ShareModal
              title={formatMessage({ id: 'button.shareProfile' })}
              url={window.location.href}
            />
          </Modal>
        </Feature>
        {socialLinks?.length > 0 && socialLinks.some((e: any) => e.url) && (
          <ButtonRow icon={<SocialLinks list={socialLinks} />} ungroup>
            {formatMessage({ id: 'term.follow' })} {firstName}
          </ButtonRow>
        )}
      </div>
    </Panel>
  )
}

export default ProfileDetails
