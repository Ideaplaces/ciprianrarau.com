import Alert from 'components/feedback/Alert'
import { useDOMInteraction } from 'lib/DOMInteraction'
import { useCurrentGroup } from 'lib/GroupContext'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const AccessDenied = () => {
  const { formatMessage, locale } = useIntl()
  const { marketplace } = useCurrentGroup()

  const { DOMElement: intercomMsg } = useDOMInteraction({
    selector: '#intercom-container',
  })
  const { DOMElement: intercomIcon } = useDOMInteraction({
    selector: '.intercom-launcher',
  })

  const intercomButton = intercomMsg || intercomIcon

  const title = formatMessage({ id: 'session.accessDenied' })
  const description = (
    <>
      <p>{formatMessage({ id: 'session.ifWrongDenial' })}</p>
      {marketplace && intercomButton ? (
        <button className="underline" onClick={intercomButton.click}>
          {formatMessage({ id: 'menu.contact' })}
        </button>
      ) : (
        <Link href={`/${locale}/personal/messaging`}>
          <a className="underline">
            {formatMessage({ id: 'tooltip.contactPM' })}
          </a>
        </Link>
      )}
    </>
  )

  const image = '/images/faq-girl.png'

  return (
    <div className="wrapper flex flex-1">
      <div className="container mx-auto">
        <div className="flex justify-center flex-col space-x-0 space-y-8 md:space-x-20 md:space-y-0 md:flex-row my-12 mx-auto">
          <div className="flex-grow-1 my-auto">
            <Alert
              type="subtle"
              title={title}
              description={description}
              showIcon
            />
          </div>
          <div className="mx-auto items-center justify-center">
            <img src={image} className="w-96 mx-auto" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
