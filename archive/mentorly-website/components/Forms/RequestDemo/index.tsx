import { Button } from 'components/Button'
import { H3 } from 'components/Headings'
import Modal from 'components/Modal'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'

import RequestDemoForm from './RequestDemoForm'

type RequestDemoProps = {
  formId: string
  messageId?: string
  className?: string
}

export const RequestDemo: VFC<RequestDemoProps> = ({
  formId,
  messageId,
  className,
}) => {
  const intl = useIntl()
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  return (
    <>
      <Button onClick={open} className={className}>
        {intl.formatMessage({ id: messageId || 'button.showMeHowItWorks' })}
      </Button>
      <Modal open={showDialog} close={close} className="bg-purple p-10">
        <>
          <div className="mb-12">
            <H3>
              {intl.formatMessage({
                id: messageId || 'button.showMeHowItWorks',
              })}
            </H3>
          </div>
          <RequestDemoForm id={formId} onSubmit={close} />
        </>
      </Modal>
    </>
  )
}
