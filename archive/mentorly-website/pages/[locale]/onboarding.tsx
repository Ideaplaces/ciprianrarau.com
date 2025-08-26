import { gql } from '@apollo/client'
import { getFeatureFlag } from 'components/Feature'
import Spinner from 'components/feedback/Spinner'
import { H3 } from 'components/Headings'
import ProgramQuestions from 'components/Matching/ProgramQuestions'
import OnboardingLayout from 'components/Onboarding/Layout'
// import PicForm from 'components/Onboarding/PicForm'
import ProfileForm, { DisciplineType } from 'components/Onboarding/ProfileForm'
import Progression from 'components/Onboarding/Progression'
// import SettingsForm from 'components/Onboarding/SettingsForm'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { event } from 'nextjs-google-analytics'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  CurrentUserProgramQuestionFieldsFragmentDoc,
  Maybe,
  OnboardingPageQuery,
  PicFormFieldsFragmentDoc,
  ProfileFormFieldsFragmentDoc,
  SettingsFormFieldsFragmentDoc,
  useOnboardingPageQuery,
} from 'types/graphql'

gql`
  query onboardingPage {
    viewer {
      ...ProfileFormFields
      ...CurrentUserProgramQuestionFields
      ...PicFormFields
      ...SettingsFormFields
    }
  }
  ${ProfileFormFieldsFragmentDoc}
  ${PicFormFieldsFragmentDoc}
  ${CurrentUserProgramQuestionFieldsFragmentDoc}
  ${SettingsFormFieldsFragmentDoc}
`

export type OnboardingFormsProps = {
  goNext?: () => void
  goPrev?: () => void
  step: number
  formKey?: 'matching' | 'picture' | 'profile' | 'settings'
  groupStyles?: GroupStylesType
  user: Maybe<OnboardingPageQuery['viewer']>
  noMatching?: boolean
  disciplines?: DisciplineType[]
  required?: boolean
  mentor?: boolean
  setMentor?: (value: boolean) => void
}

export type GroupStylesType = {
  btnPrimary: {
    backgroundColor: string
    color: string
  }
  btnSecondary: {
    backgroundColor: string
    borderColor: string
    color: string
  }
  icon: {
    backgroundColor: string
    color: string
  }
  label: {
    color: string
  }
  user?: OnboardingPageQuery['viewer']
  noMatching?: boolean
}

const Onboarding = () => {
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const firstName = currentUser?.name.split(' ')[0]
  const [step, setStep] = useState(0)
  const [mentorToggle, setMentor] = useState<boolean | null>(null)
  const { push, query } = useRouter()
  const { formatMessage, locale } = useIntl()
  const noMatching =
    !currentGroup ||
    (!currentGroup.autoMatching && !currentGroup.manualMatching)

  const { data: userData } = useOnboardingPageQuery({
    skip: !currentUser,
  })

  // initialize shallow routing
  useEffect(() => {
    push(`/${locale}/onboarding/?step=0`, undefined, { shallow: true })
  }, [])

  // Prevent autoscroll when click back/next browser buttons
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    push(`/${locale}/onboarding/?step=${step}`, undefined, { shallow: true })
  }, [step])

  // Manage change form when click back/next browser buttons
  useEffect(() => {
    if (query.step && parseInt(query.step as string) < step) {
      setStep(step - 1)
    }
    if (query.step && parseInt(query.step as string) > step) {
      setStep(step + 1)
    }
  }, [query])

  const goPrev = () => {
    push(`/${locale}/onboarding/?step=${step - 1}`, undefined, {
      shallow: true,
    })
    setStep(step - 1)
  }

  const goNext = () => {
    event('Onboarding Step', {
      category: 'Onboarding',
      label: `completed_onboarding_step_${step + 1}`,
      // userId: currentUser.id,
    })
    push(`/${locale}/onboarding/?step=${step + 1}`, undefined, {
      shallow: true,
    })
    setStep(step + 1)
  }

  const required = !!getFeatureFlag(currentGroup, 'onboardingRequired')
  const user = userData?.viewer

  if (!user) {
    return <Spinner />
  }

  const mentor = mentorToggle === null ? user?.mentor : mentorToggle

  const matchingQuestionsKey = getFeatureFlag(
    currentGroup,
    'matchingQuestionsKey'
  ) as string

  const forms = [
    <ProfileForm
      key={1}
      goNext={goNext}
      formKey="profile"
      step={step}
      user={user}
      disciplines={currentGroup?.disciplines}
      noMatching={false}
      required={required}
      mentor={mentor}
      setMentor={setMentor}
    />,
    <ProgramQuestions
      key={2}
      formKey={matchingQuestionsKey}
      goPrev={goPrev}
      step={step}
      noMatching={noMatching}
      page="onboarding"
      user={user}
      mentor={mentor}
    />,
  ]
  const currentForm = forms[step]

  if (!currentUser) return <Spinner />

  if (!getFeatureFlag(currentUser.group, 'onboarding')) {
    push('/')
    return null
  }

  return (
    <div className="relative z-10">
      <H3 className="text-black text-center px-6">
        {formatMessage({ id: 'header.onboarding' }, { firstName })}
      </H3>
      <div className="max-w-5xl mx-auto hidden md:block">
        <Progression step={step} noMatching={noMatching} />
      </div>
      <div className="flex justify-center">
        <div className="bg-white shadow-md rounded-md p-6 mx-autos w-full max-w-md">
          {currentForm}
        </div>
      </div>
    </div>
  )
}

Onboarding.Layout = OnboardingLayout
export const getServerSideProps = connectServerSideProps(Onboarding)
export default Onboarding
