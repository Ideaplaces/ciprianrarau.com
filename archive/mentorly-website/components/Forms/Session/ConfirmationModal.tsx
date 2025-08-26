import Button from 'components/Button/Button'
import NewSession from 'components/Forms/Session/NewSession'
import { H3 } from 'components/Headings'
import { useModal } from 'components/Modal/ModalContext'
import SessionCard from 'components/Sessions/SessionCard'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { sessionIndexUrl } from 'lib/urls'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { SessionCardFieldsFragment } from 'types/graphql'

type ConfirmationModalProps = {
  booking: SessionCardFieldsFragment
}

const ConfirmationModal: VFC<ConfirmationModalProps> = ({ booking }) => {
  const { formatMessage, locale } = useIntl()
  const { isDashboard } = useCurrentGroup()
  const { showModal, hideModal, isOpen } = useModal()
  const { push } = useRouter()

  if (!booking) return null

  const handleCreateAnother = () => {
    if (isOpen) {
      push(sessionIndexUrl(locale, isDashboard) + '/new')
      hideModal()
    } else {
      showModal({
        width: 'md',
        content: <NewSession onCancel={hideModal} />,
      })
    }
  }

  const cardOutline = 'border border-darkGray rounded-md mb-6'

  return (
    <>
      <H3>{formatMessage({ id: 'tooltip.success' })}</H3>
      <SessionCard booking={booking} format="modal" className={cardOutline} />
      <div className="flex justify-start space-x-2">
        <Button onClick={handleCreateAnother} className="mb-4">
          {formatMessage({ id: 'button.createAnotherSession' })}
        </Button>
      </div>
    </>
  )
}

export default ConfirmationModal
