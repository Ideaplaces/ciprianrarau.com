import AccountSignUpForm from 'components/Forms/SignUp/AccountSignUp'
import HalfPageWave from 'components/layout/HalfPageWave'
import Image from 'next/image'
import image from 'public/images/faq-girl-cropped.png'
import { useIntl } from 'react-intl'

const SignUpPage = () => {
  const { formatMessage } = useIntl()
  const bg = '#fdde35'
  const color = '#111'

  return (
    <HalfPageWave color={bg}>
      <div id="signupForm" style={{ color: color }}>
        <div id="header">
          <div id="join-image" className="flex items-end relative mb-4">
            <h1 className={`text-3xl full font-bold`}>
              {formatMessage({ id: 'signup.tryMentorly' })}
            </h1>
          </div>
          <div>{formatMessage({ id: 'signup.freeTrial' })}</div>
          <div className="mb-4">
            {formatMessage({ id: 'signup.worldClass' })}
          </div>
        </div>
        <AccountSignUpForm />
      </div>
      <div id="sidePanel" className="pl-0 md:pl-12 flex flex-col items-start">
        <Image src={image} alt="Welcome" />
      </div>
    </HalfPageWave>
  )
}

export default SignUpPage
