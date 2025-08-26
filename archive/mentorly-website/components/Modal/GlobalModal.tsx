// Global modal component
// To set the open/close behavior, set the open boolean from the parent, close with the close callback
// To prevent user from closing the modal, use noX

import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { motion } from 'lib/framer-motion'
import { Fragment, VFC } from 'react'
import { X } from 'react-feather'

import { handleChildren } from '../Generic/util'

export type ModalProps = {
  open: boolean
  close: () => void
  widthClass?: string
  noX?: boolean
  padding?: string
  className?: string
  content: any
}

export const GlobalModal: VFC<ModalProps> = (props) => {
  const { open, close, widthClass, noX, padding, className } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog className="z-50 relative" as="div" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-0"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-0"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                className={classNames(
                  widthClass,
                  'transform rounded-2xl bg-white text-left align-middle shadow-lg transition-all',
                  padding ? padding : 'p-8 md:p-12 lg:p-16',
                  className
                )}
                aria-label="modal"
              >
                {!noX && (
                  <button
                    onClick={close}
                    data-testid="close-modal"
                    className="absolute right-0 top-0 mt-4 focus:outline-none z-top"
                  >
                    <div className="sr-only">Close</div>
                    <motion.div
                      aria-hidden
                      className="text-4xl pr-4"
                      whileTap={{
                        scale: 0.9,
                      }}
                    >
                      <X />
                    </motion.div>
                  </button>
                )}
                <div className="flex flex-col w-full">
                  {handleChildren(props.content, {
                    ...props,
                  })}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
