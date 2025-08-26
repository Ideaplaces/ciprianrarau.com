import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import ErrorDetails from 'components/Error/ErrorDetails'
import { H3 } from 'components/Headings'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentGroup } from 'lib/GroupContext'
import { isEmpty, upperFirst } from 'lodash'
import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  CreateDisciplineMutation,
  CreateSubdisciplineMutation,
  DisciplineFieldsFragment,
  useCreateDisciplineMutation,
  useCreateSubdisciplineMutation,
} from 'types/graphql'

import { DisciplinesType } from './UpdateModal'

type AddModalProps = {
  type: DisciplinesType
  selectedDiscipline?: DisciplineFieldsFragment
  setSelectedDisciplineId: Dispatch<SetStateAction<string | undefined>>
  title: string
}

const AddModal: FC<AddModalProps> = ({
  type,
  title,
  selectedDiscipline,
  setSelectedDisciplineId,
}) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [createDiscipline] = useCreateDisciplineMutation()
  const [createSubdiscipline] = useCreateSubdisciplineMutation()
  const { hideModal } = useModal()

  const handleCreate = async (type: DisciplinesType, values: any) => {
    const mutation =
      type === 'discipline' ? createDiscipline : createSubdiscipline

    if (type === 'subdiscipline') {
      values.disciplineId = selectedDiscipline?.id
    }

    try {
      const { data } = await mutation({
        variables: { values: { groupId: currentGroup.id, ...values } },
        refetchQueries: ['groupDisciplines'],
      })

      const { errors, errorDetails } =
        (data as CreateDisciplineMutation)?.createDiscipline ||
        (data as CreateSubdisciplineMutation)?.createSubdiscipline ||
        {}

      if (!isEmpty(errors) || !isEmpty(errorDetails)) {
        console.error(errors, errorDetails)
        toast.error(<ErrorDetails errorDetails={errorDetails} />)
      }

      const newDiscipline = (data as CreateDisciplineMutation)?.createDiscipline
        ?.discipline

      newDiscipline && setSelectedDisciplineId(newDiscipline.id)

      hideModal()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form
      id={type}
      initialValues={{ [type]: undefined }}
      onSubmit={(values) => handleCreate(type, values)}
      className="p-10"
    >
      {({ isSubmitting }: { isSubmitting: boolean }) => (
        <>
          <H3>{title}</H3>
          {currentGroup.languages.map((lang) => (
            <Field key={lang.id} name={`name${upperFirst(lang.code)}`} />
          ))}
          <Button loading={isSubmitting} type="submit" className="mb-1">
            {formatMessage({ id: 'button.add' })}
          </Button>
        </>
      )}
    </Form>
  )
}

export default AddModal
