import classNames from 'classnames'
import Button from 'components/Button'
import CountrySelect from 'components/controls/CountrySelect'
import Field from 'components/controls/Field'
import ImageUpload from 'components/controls/Image'
import LanguageSelect from 'components/controls/LanguageSelect'
import RadioSelect from 'components/controls/RadioSelect'
import RecordSelect from 'components/controls/RecordSelect'
import SimpleSelect from 'components/controls/SimpleSelect'
import Textarea from 'components/controls/Textarea'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import Files from 'components/Forms/Files'
import { marketNames, peopleNetworkList } from 'data/markets'
import { FormikContextType, FormikValues, useFormikContext } from 'formik'
import gql from 'graphql-tag'
import { fileTypesAllowed } from 'lib/fileTypesAllowed'
import { useCurrentGroup } from 'lib/GroupContext'
import { subdisciplines } from 'lib/selectHelpers'
import { groupHost } from 'lib/urls'
import { isArray } from 'lodash'
import { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import {
  Maybe,
  MemberProfileFieldsFragment,
  SocialNetworksFieldsFragmentDoc,
  UserFileFieldsFragmentDoc,
  UserProfileFieldsFragment,
} from 'types/graphql'

import SocialNetworks from './SocialNetworks'

gql`
  fragment MemberProfileFields on ManagedUser {
    id
    countryCode
    slug
    name
    market
    mentor
    peopleNetwork
    profileImageUrl(width: 500, height: 500)
    profilePercent
    onboardingPercent
    pronouns
    company
    role
    languages {
      code
      id
      name
    }
    experience
    location
    discipline {
      id
      imageUrl
      name
      slug
      subdisciplines {
        id
        name
        slug
      }
    }
    disciplines {
      id
      imageUrl
      name
      slug
      subdisciplines {
        id
        name
        slug
      }
    }
    subdisciplines {
      id
      name
      slug
    }
    skills
    website
    description
    welcomeMessage
    shortTermGoals
    longTermGoals
    files {
      ...UserFileFields
    }
    behanceLink
    dribbbleLink
    facebookLink
    instagramLink
    linkedinLink
    twitterLink
    vimeoLink
    youtubeLink
  }
  fragment UserProfileFields on CurrentUser {
    id
    countryCode
    slug
    name
    mentor
    profileImageUrl(width: 500, height: 500)
    profilePercent
    onboardingPercent
    pronouns
    company
    role
    languages {
      code
      id
      name
    }
    experience
    location
    discipline {
      id
      name
      slug
      subdisciplines {
        id
        name
        slug
      }
    }
    disciplines {
      id
      name
      slug
      subdisciplines {
        id
        name
        slug
      }
    }
    subdisciplines {
      id
      name
      slug
    }
    skills
    website
    description
    welcomeMessage
    shortTermGoals
    longTermGoals
    files {
      ...UserFileFields
    }
    ...SocialNetworksFields
  }
  ${SocialNetworksFieldsFragmentDoc}
  ${UserFileFieldsFragmentDoc}
`

type UserProfileProps = {
  group: {
    id: string
    slug: string
    customDomain?: Maybe<string>
  }
  user?: Maybe<MemberProfileFieldsFragment | UserProfileFieldsFragment>
  disciplines?: Maybe<UserProfileFieldsFragment['discipline'][]>
  isSelf?: boolean
  formValues: FormikValues
  page?: string
  refetch: () => void
  mentor?: boolean
  setMentor?: (value: boolean) => void
}

const accountType = [
  { value: false, name: 'Mentee' },
  { value: true, name: 'Mentor' },
]

const UserProfile = ({
  group,
  user,
  disciplines = [],
  isSelf,
  formValues,
  page,
  refetch,
  mentor,
  setMentor,
}: UserProfileProps) => {
  const { values, isSubmitting } = useFormikContext() as FormikContextType<any>
  const { formatMessage, locale } = useIntl()

  if (!user) {
    return (
      <Alert type="error" className="mb-4" showIcon>
        {formatMessage({ id: 'alert.saveBeforeContinue' })}
      </Alert>
    )
  }

  // @TODO: refactor
  const onboardingFieldStyle = (field: string) => {
    if (page !== 'personal') return undefined
    const fieldIsEmpty =
      !formValues[field] ||
      (isArray(formValues[field]) && formValues[field].length === 0)
    return classNames({
      'rounded-md shadow-md border-3 border-purple shadow-purple':
        user.onboardingPercent !== 100 && fieldIsEmpty,
    })
  }

  const customURLPrefix = `${groupHost(group)}/${locale}/${
    user.mentor ? 'mentors' : 'mentees'
  }/`

  const customURLPlaceholder = formatMessage(
    { id: 'field.placeholder.customURL' },
    { name: user.name.split(' ').join('').toLowerCase() }
  )

  const profileUrl = customURLPrefix + (values.slug || user.id)

  return (
    <div>
      {user.profilePercent < 100 && page === 'personal' && (
        <Alert className="mb-6">
          {formatMessage({ id: 'text.missingOnboardingProfileFields' })}
        </Alert>
      )}
      <Field
        name="newProfileImage"
        control={ImageUpload}
        defaultValue={values.profileImageUrl}
      />
      {getFeatureFlag(group, 'roleSelection') && (
        <Field
          name="mentor"
          // className="flex flex-col lg:space-x-2 lg:flex-row"
          // controlClassName="lg:ml-4 flex space-x-2"
          control={RadioSelect}
          options={accountType}
          customChangeHandler={(value) => setMentor && setMentor(value)}
        />
      )}
      <div className="flex gap-3">
        <div className="w-1/2">
          <Field name="name" placeholder="Full name" />
        </div>
        <div className="w-1/2">
          <Field name="pronouns" />
        </div>
      </div>
      {getFeatureFlag(group, 'userCompany') && <Field name="company" />}
      <Field name="role" />
      {getFeatureFlag(group, 'userLanguages') && (
        <Field
          name="languages"
          type="select"
          control={LanguageSelect}
          isMulti
        />
      )}
      {getFeatureFlag(group, 'userExperience') && (
        <Field name="experience" type="number" min={0} max={99} />
      )}
      <Field name="location" type="text" />
      {getFeatureFlag(group, 'userCountry') && (
        <Field name="countryCode" type="select" control={CountrySelect} />
      )}
      {getFeatureFlag(group, 'userMarket') && (
        <Field
          name="market"
          type="select"
          control={RadioSelect}
          options={marketNames}
        />
      )}
      {getFeatureFlag(group, 'peopleNetwork') && (
        <Field
          name="peopleNetwork"
          type="select"
          control={SimpleSelect}
          options={peopleNetworkList}
          isMulti
        />
      )}
      <Field
        name="disciplines"
        type="select"
        control={RecordSelect}
        options={disciplines}
        controlClassName={onboardingFieldStyle('discipline') || undefined}
        isMulti
        instructions={formatMessage({ id: 'term.chooseMany' })}
      />
      {getFeatureFlag(group, 'userSubdisciplines') && disciplines && (
        <Field
          name="subdisciplines"
          type="select"
          control={RecordSelect}
          options={subdisciplines(disciplines, values.disciplines)}
          controlClassName={onboardingFieldStyle('subdisciplines') || undefined}
          isMulti
          instructions={formatMessage({ id: 'term.chooseMany' })}
        />
      )}
      {getFeatureFlag(group, 'userSkills') && (
        <Field
          name="skills"
          label={
            mentor ? undefined : formatMessage({ id: 'term.soughtAfterSkills' })
          }
          placeholder={formatMessage({
            id: `form.placeholder.describe${mentor ? 'Your' : 'Desired'}Skills`,
          })}
          controlClassName={onboardingFieldStyle('skills') || undefined}
        />
      )}
      <Field name="website" placeholder="https://example.com/" strip />
      {mentor ? (
        <MentorFields onboardingFieldStyle={onboardingFieldStyle} />
      ) : (
        <MenteeFields onboardingFieldStyle={onboardingFieldStyle} />
      )}
      {getFeatureFlag(group, 'userDescription') && (
        <Field
          name="description"
          label={mentor ? undefined : formatMessage({ id: 'term.whyIJoined' })}
          placeholder={formatMessage({
            id: 'form.placeholder.describeYourself',
          })}
          control={Textarea}
          controlClassName={onboardingFieldStyle('description') || undefined}
          border={!onboardingFieldStyle('description')}
        />
      )}
      <div className="flex justify-between">
        <SectionHeading text={formatMessage({ id: 'header.media' })} />
      </div>
      <Files
        type="file"
        // table="User"
        data={user?.files || []}
        userId={user.id}
        groupId={group.id}
        allowedFileTypes={fileTypesAllowed}
        isSelf={isSelf}
        refetch={refetch}
        multiple
      />
      <SectionHeading text={formatMessage({ id: 'term.socialNetworks' })} />
      <SocialNetworks />
      <SectionHeading text={formatMessage({ id: 'term.customURL' })} />
      <Field
        name="slug"
        prefix={customURLPrefix}
        placeholder={customURLPlaceholder}
        copyable={profileUrl}
        strip={/[^a-zA-Z0-9-_]/}
      />
      <Button loading={isSubmitting} type="submit">
        {formatMessage({ id: 'button.save' })}
      </Button>
    </div>
  )
}

type UserFieldsProps = {
  onboardingFieldStyle?: (field: string) => string | undefined
}

export const MenteeFields = ({ onboardingFieldStyle }: UserFieldsProps) => (
  <>
    <Field
      name="longTermGoals"
      controlClassName={
        onboardingFieldStyle && onboardingFieldStyle('longTermGoals')
      }
    />
    <Field
      name="shortTermGoals"
      controlClassName={
        onboardingFieldStyle && onboardingFieldStyle('shortTermGoals')
      }
    />
  </>
)

export const MentorFields = ({ onboardingFieldStyle }: UserFieldsProps) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  return (
    <>
      {getFeatureFlag(currentGroup, 'userWelcomeMessage') && (
        <Field
          name="welcomeMessage"
          control={Textarea}
          strip={/[\n]/}
          placeholder={formatMessage({
            id: 'form.placeholder.welcomeMessage',
          })}
          controlClassName={
            onboardingFieldStyle && onboardingFieldStyle('welcomeMessage')
          }
          border={
            onboardingFieldStyle
              ? !onboardingFieldStyle('welcomeMessage')
              : 'gray'
          }
        />
      )}
    </>
  )
}

type SectionHeadingProps = {
  text: ReactNode
}
const SectionHeading = ({ text }: SectionHeadingProps) => (
  <h3 className="font-black text-xl mb-4">{text}</h3>
)

export default UserProfile
