import classNames from 'classnames'
import Button from 'components/Button/Button'
import { GlobalModal } from 'components/Modal/GlobalModal'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useModal } from './ModalContext'

type ConfirmationModalProps = {
  question: string
  title: string
  onConfirm: () => void
  onDecline: () => void
  [x: string]: any
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  newModal = true,
  ...props
}) => {
  const { hideModal } = useModal()
  if (newModal) {
    return (
      <GlobalModal
        widthClass="max-w-xs"
        padding="p-0"
        open={true}
        content={<ConfirmationModalContent {...props} />}
        close={hideModal}
      />
    )
  }
  return (
    <div>
      <ConfirmationModalContent {...props} />
    </div>
  )
}

type ButtonBarProps = {
  onDecline: () => void
  onConfirm: () => void
  className?: string
  isSubmitting?: boolean
  isValid?: boolean
}

export const ButtonBar: FC<ButtonBarProps> = ({
  onDecline,
  onConfirm,
  className,
  isSubmitting,
  isValid = true,
}) => {
  const { formatMessage } = useIntl()
  return (
    <div
      className={classNames(
        'flex bg-darkGray justify-between px-8 py-4 w-100',
        className
      )}
    >
      <Button variant="secondary" onClick={onDecline}>
        {formatMessage({ id: 'button.cancel' })}
      </Button>
      <Button
        variant="primary"
        onClick={onConfirm}
        type="submit"
        loading={isSubmitting}
        disabled={!isValid}
      >
        {formatMessage({ id: 'button.confirm' })}
      </Button>
    </div>
  )
}

const ConfirmationModalContent: FC<ConfirmationModalProps> = ({
  question,
  title,
  onDecline,
  onConfirm,
}) => (
  <div>
    <div className="p-8">
      {title && <h4 className="text-2xl font-black mb-4">{title}</h4>}
      <div className="min-h-18">{question}</div>
    </div>
    <ButtonBar onDecline={onDecline} onConfirm={onConfirm} />
  </div>
)

export default ConfirmationModal
