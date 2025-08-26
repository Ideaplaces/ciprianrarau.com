import { MutationHookOptions, MutationTuple } from '@apollo/client'
import CohortForm from 'components/Dashboard/Members/CohortsForm'
import IconButton from 'components/general/IconButton'
import { useModal } from 'components/Modal/ModalContext'
import { VFC } from 'react'
import { Plus as AddIcon } from 'react-feather'

type AddCohortButtonProps = {
  groupId: string
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
}

const AddCohortButton: VFC<AddCohortButtonProps> = ({
  groupId,
  typedMutation,
}) => {
  const [addRow] = typedMutation({
    onCompleted: () => hideModal(),
    refetchQueries: ['dashboardCohorts'],
  })

  const { showModal, hideModal } = useModal()

  const handleSubmit = (attributes: any) => {
    addRow({
      variables: {
        groupId,
        attributes,
      },
    })
  }

  const defaultValues = { name: '' }

  return (
    <>
      <IconButton
        icon={AddIcon}
        onClick={() => {
          showModal({
            content: (
              <div className="bg-white shadow p-4">
                <CohortForm row={defaultValues} onSubmit={handleSubmit} />
              </div>
            ),
          })
        }}
      />
    </>
  )
}

export default AddCohortButton
