// import Check from 'components/display/Check'
import { gql } from '@apollo/client'
import SignUpForm from 'components/Forms/SignUp/SignUp'
import HalfPageWave from 'components/layout/HalfPageWave'
import { useCurrentGroup } from 'lib/GroupContext'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { ProgramInfoFieldsFragment } from 'types/graphql'

// @TODO: use new class styles rather than group.styles object
type SignUpPageProps = {
  group?: ProgramInfoFieldsFragment
  redirect: string
}
const SignUpPage: VFC<SignUpPageProps> = ({ group, redirect }) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const bg = currentGroup?.styles?.backgroundColor || '#fdde35'
  const color = currentGroup?.styles?.backgroundTextColor || '#111'

  return (
    <HalfPageWave color={bg}>
      <div id="signupForm" style={{ color: color }}>
        <div id="header">
          <div id="join-image" className="flex items-end relative mb-4">
            <h1 className={`text-3xl full`}>{group?.title || 'Mentorly'}</h1>
          </div>
          {!group && (
            <div className="mb-4">
              {formatMessage({ id: 'header.signUpAndConnect' })}
            </div>
          )}
        </div>
        <SignUpForm group={group} redirect={redirect} />
      </div>
      <div
        id="sidePanel"
        className="pl-0 md:mt-12 md:pl-12 flex flex-col items-start"
      >
        <ProgramInfo group={group} />
      </div>
    </HalfPageWave>
  )
}

gql`
  fragment ProgramInfoFields on Group {
    id
    slug
    styles {
      titleFontName
    }
    title
    subtitle
    marketplace
    backgroundImages {
      imageUrl
    }
  }
`

type PropgramInfoProps = {
  group?: ProgramInfoFieldsFragment
}

const ProgramInfo: VFC<PropgramInfoProps> = ({ group }) => (
  <div className="flex flex-col sm:flex-row md:flex-col-reverse mt-0 sm:mt-4 md:mt-0 space-x-0 sm:space-x-10 md:space-x-0 items-center">
    <div>
      <div
        style={{ fontFamily: group?.styles?.titleFontName || 'sans-serif' }}
        className={`pb-4 font-bold text-2xl`}
      >
        {group?.title}
      </div>
      <div className={`mb-4 w-full text-lg`}>{group?.subtitle}</div>
    </div>
    <div className="h-auto pb-6 w-full lg:w-2/3 z-10">
      <img
        className="object-fit"
        src={
          group?.marketplace
            ? '/images/faq-girl.png'
            : group?.backgroundImages[0]?.imageUrl || ''
        }
        alt=""
      />
    </div>
  </div>
)

export default SignUpPage
