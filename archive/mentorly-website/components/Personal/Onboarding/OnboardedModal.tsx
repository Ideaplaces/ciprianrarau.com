import Button from 'components/Button/Button'
import { H3 } from 'components/Headings'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

type OnboardedModalProps = {
  close: () => void
}

const OnboardedModal: VFC<OnboardedModalProps> = ({ close }) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()

  const role = currentUser?.mentor ? 'mentor' : 'mentee'

  return (
    <>
      <H3>
        {formatMessage({ id: 'header.youAreOnboarded' })}&nbsp;
        <span role="img" aria-label="party">
          🎉
        </span>
      </H3>
      <p className="text-lg">
        {formatMessage({
          id: `text.youAreOnboarded.${role}`,
        })}
      </p>

      {currentUser?.mentor ? (
        <Link href={`/${locale}/personal`} passHref>
          <Button className="mt-8" variant="secondary" onClick={close}>
            {formatMessage({ id: 'button.goToDashboard' })}
          </Button>
        </Link>
      ) : (
        <Link href={`/${locale}/mentors`} passHref>
          <Button className="mt-8" variant="secondary" onClick={close}>
            {formatMessage({ id: 'button.browseMentors' })}
          </Button>
        </Link>
      )}
    </>
  )
}

export default OnboardedModal
