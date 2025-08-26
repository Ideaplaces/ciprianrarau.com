import React, { createContext, FC, useContext, useState } from 'react'

import { GlobalModal } from './GlobalModal'

type ModalProps = {
  width?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  noX?: boolean
  padding?: string
  className?: string
  content: any
  callback?: () => void
}

type ModalContextProps = {
  showModal: (modalProps: ModalProps) => void
  hideModal: () => void
  isOpen: boolean
}

const defaultValue: ModalContextProps = {
  showModal: () => {},
  hideModal: () => {},
  isOpen: false,
}

export const ModalContext = createContext(defaultValue)

const ModalProvider: FC = ({ children }) => {
  const defaultModalProps: ModalProps = {
    noX: false,
    padding: undefined,
    width: 'md',
    className: '',
    content: <></>,
    callback: () => null,
  }

  const [show, setShow] = useState(false)
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps)
  const { noX, padding, width, className, content, callback } = modalProps

  const modalContextProps: ModalContextProps = {
    showModal: (props) => {
      setModalProps({ ...modalProps, ...props })
      setShow(true)
    },
    hideModal: () => {
      setShow(false)
      callback && callback()
    },
    isOpen: show,
  }

  const widths: any = {
    xl: 'w-full md:w-10/12',
    lg: 'w-full md:w-7/12 xl:w-1/2',
    md: 'w-full md:w-1/2 xl:w-5/12',
    sm: 'w-screen sm:w-xs',
    xs: 'max-w-sm',
  }

  const widthClass = widths[width || 'md']

  return (
    <ModalContext.Provider value={modalContextProps}>
      <GlobalModal
        open={show}
        close={modalContextProps.hideModal}
        noX={noX}
        padding={padding}
        widthClass={widthClass}
        className={className}
        content={content}
      />
      {children}
    </ModalContext.Provider>
  )
}
export const useModal = () => useContext(ModalContext)

export default ModalProvider
