import Modal from 'components/Modal'
import React from 'react'

interface DebugInfoModalProps {
  title: string
  prompt: string
  data: any
  onClose: () => void
}

const DebugInfoModal: React.FC<DebugInfoModalProps> = ({
  title,
  prompt,
  data,
  onClose,
}) => {
  return (
    <Modal
      open
      close={onClose}
      title={title}
      onClose={onClose}
      width="4xl"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Prompt:</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Data:</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DebugInfoModal
