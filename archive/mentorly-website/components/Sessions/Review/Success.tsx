import { ButtonLink } from 'components/Button'
import { H3 } from 'components/Headings'
import Link from 'next/link'
import { VFC } from 'react'
import { Grid, MessageSquare, Monitor } from 'react-feather'
import { useIntl } from 'react-intl'

type SuccessProps = {
  sessionId: string
  isMarketplace?: boolean
  conversationId?: string
  isSessionValid?: boolean
}
const Success: VFC<SuccessProps> = ({
  sessionId,
  isMarketplace,
  conversationId,
  isSessionValid,
}) => {
  const { formatMessage, locale } = useIntl()
  const extraMenu = [
    {
      icon: <Monitor />,
      label: formatMessage({ id: 'review.options.bookAnother' }),
      link: isMarketplace ? '/mentors' : `/${locale}/mentors`,
    },
  ]

  if (conversationId) {
    extraMenu.push({
      icon: <MessageSquare />,
      label: formatMessage({ id: 'review.options.message' }),
      link: `/${locale}/personal/messaging/${conversationId}`,
    })
  }

  extraMenu.push({
    icon: <Grid />,
    label: formatMessage({ id: 'review.options.goToDashboard' }),
    link: `/${locale}/personal`,
  })

  return (
    <>
      <H3>{formatMessage({ id: 'review.success.thanks' })}</H3>
      {isSessionValid && (
        <Link href={`/${locale}/conferences/${sessionId}`} passHref>
          <ButtonLink
            className="mr-3 mb-3 text-sm rounded-full hover:opacity-75"
            variant="selected"
          >
            {formatMessage({ id: 'review.form.rejoinButton' })}
          </ButtonLink>
        </Link>
      )}

      <div className="flex flex-col mt-10 text-blue">
        {extraMenu.map((item) => (
          <Link key={item.label} href={`${item.link}`} passHref>
            <div className="flex my-1 hover:bg-gray py-2 cursor-pointer">
              <div className="mx-2">{item.icon}</div>
              <div>{item.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Success
