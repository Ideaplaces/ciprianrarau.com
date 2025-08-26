import classNames from 'classnames'
import UserProgressHelp from 'components/Dashboard/UserProgressHelp'
import Pill from 'components/display/Pill'
import Modal from 'components/Modal'
import { camelCase } from 'lodash'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'

type ProgressPillProps = {
  status: string
  className?: string
  noModal?: boolean
  testId?: string
}

const ProgressPill: VFC<ProgressPillProps> = ({
  status,
  className,
  noModal = false,
  testId,
}) => {
  const { formatMessage } = useIntl()
  const [open, setOpen] = useState(false)

  const statusString = camelCase(status)

  return (
    <>
      <Modal open={open} close={() => setOpen(false)}>
        <UserProgressHelp />
      </Modal>
      <span
        onClick={() => {
          if (!noModal) {
            setOpen(true)
          }
        }}
        className={classNames({
          'cursor-pointer hover:opacity-75': !noModal,
        })}
      >
        <Pill
          color={`status-${statusString}`}
          fontSize="xs"
          className={classNames('text-white', className)}
          testId={testId}
        >
          <div style={{ paddingBottom: '1px' }}>
            {formatMessage({ id: `term.${statusString}` })}
          </div>
        </Pill>
      </span>
    </>
  )
}

export default ProgressPill
