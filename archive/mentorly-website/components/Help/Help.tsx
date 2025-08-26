import Modal from 'components/Modal'
import React, { useState, VFC } from 'react'
import { Info } from 'react-feather'

export type HelpProps = {
  linkText: string
  modalContent: any
}

const Help: VFC<HelpProps> = ({ linkText, modalContent }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Modal open={open} width="sm" close={() => setOpen(false)}>
        {modalContent}
      </Modal>
      <div
        className="pt-4 flex text-sm text-highlightColor bold items-center cursor-pointer select-none"
        onClick={() => setOpen(true)}
      >
        <Info width={22} />
        <span className="ml-1 ">{linkText}</span>
      </div>
    </>
  )
}

export default Help
