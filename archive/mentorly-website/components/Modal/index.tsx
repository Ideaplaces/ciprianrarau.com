import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { handleChildren } from 'components/Generic/util'
import { motion } from 'lib/framer-motion'
import { FC, Fragment, ReactNode } from 'react'
import { X } from 'react-feather'

type ModalProps = {
  open: boolean
  close: () => void
  noX?: boolean
  children: ReactNode
  padding?: boolean
  width?: string
  className?: string
  [x: string]: any
}

const Modal: FC<ModalProps> = ({
  open = true,
  close,
  noX = false,
  children,
  padding,
  width,
  className,
  ...props
}) => {
  const widths: { [x: string]: string } = {
    xl: 'w-full md:w-10/12',
    lg: 'w-full md:w-7/12 xl:w-1/2',
    md: 'w-full md:w-1/2 xl:w-5/12',
    sm: 'w-full sm:w-xs',
    xs: 'max-w-sm',
  }

  const widthClass = widths[width || 'md']

  if (!children) return null

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
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
                  'transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-lg transition-all',
                  { 'p-8 md:p-12 lg:p-16': padding },
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
                {
                  // add props to children so they can close modal
                  handleChildren(children, { close: close, ...props })
                }
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
export default Modal
