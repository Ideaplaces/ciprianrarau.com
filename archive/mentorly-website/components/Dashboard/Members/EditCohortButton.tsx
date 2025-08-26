import { MutationHookOptions, MutationTuple } from '@apollo/client'
import CohortForm from 'components/Dashboard/Members/CohortsForm'
import IconButton from 'components/general/IconButton'
import { useModal } from 'components/Modal/ModalContext'
import { VFC } from 'react'
import { Edit as EditIcon } from 'react-feather'

type EditButtonProps = {
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
  row: any
}
const EditButton: VFC<EditButtonProps> = ({ typedMutation, row }) => {
  const [updateRow] = typedMutation({
    onCompleted: () => hideModal(),
  })
  const { showModal, hideModal } = useModal()

  const handleSubmit = (attributes: any) => {
    updateRow({
      variables: {
        id: row.id,
        attributes,
      },
    })
  }

  return (
    <>
      <IconButton
        icon={EditIcon}
        onClick={() => {
          showModal({
            content: (
              <div className="bg-white shadow p-4">
                <CohortForm row={row} onSubmit={handleSubmit} />
              </div>
            ),
          })
        }}
      />
    </>
  )
}

export default EditButton
