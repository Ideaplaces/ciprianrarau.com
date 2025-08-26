import { getFeatureFlag } from 'components/Feature'
import AccountSignUp from 'components/pages/AccountSignUp'
import SignUp from 'components/pages/SignUp'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { allowSignUpGroupUser } from 'lib/signUp'
import { connectServerSideProps } from 'lib/ssg'
import { baseUrl } from 'lib/urls'
import { useIntl } from 'react-intl'

const SignUpPage = () => {
  const { push } = useRouter()
  const { locale } = useIntl()
  const { currentGroup, loading: loadingGroup } = useCurrentGroup()
  const skipOnboarding = currentGroup?.skipOnboarding

  const url = baseUrl(currentGroup, locale)

  if (loadingGroup) return false

  if (!allowSignUpGroupUser(currentGroup)) {
    push(`${url}/login`)
    return false
  }

  let redirectAfter

  if (getFeatureFlag(currentGroup, 'onboarding')) {
    if (skipOnboarding) {
      redirectAfter = `${url}/personal/profile`
    } else {
      redirectAfter = `${url}/onboarding`
    }
  } else {
    redirectAfter = `${url}/personal/profile`
  }

  if (currentGroup) {
    return <SignUp group={currentGroup} redirect={redirectAfter} />
  }

  return <AccountSignUp />
}

export const getServerSideProps = connectServerSideProps(SignUpPage)
export default SignUpPage
