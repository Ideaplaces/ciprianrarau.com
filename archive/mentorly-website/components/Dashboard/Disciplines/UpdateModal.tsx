import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import { H3 } from 'components/Headings'
import Confirm from 'components/Modal/Confirm'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentGroup } from 'lib/GroupContext'
import { pick, upperFirst } from 'lodash'
import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import {
  DeleteDisciplineMutation,
  DisciplineFieldsFragment,
  SubdisciplineFieldsFragment,
  useDeleteDisciplineMutation,
  useDeleteSubdisciplineMutation,
  useUpdateDisciplineMutation,
  useUpdateSubdisciplineMutation,
} from 'types/graphql'

import {
  disciplineMutationFields,
  subdisciplineMutationFields,
} from './fragments'

gql`
  mutation updateSubdiscipline($id: ID!, $values: SubdisciplineAttributes!) {
    updateSubdiscipline(id: $id, attributes: $values) {
      subdiscipline {
        ...SubdisciplineMutationFields
      }
      errors
      errorDetails
    }
  }

  mutation updateDiscipline($id: ID!, $values: DisciplineAttributes!) {
    updateDiscipline(id: $id, attributes: $values) {
      discipline {
        ...DisciplineMutationFields
      }
      errors
      errorDetails
    }
  }

  mutation deleteSubdiscipline($id: ID!) {
    deleteSubdiscipline(id: $id) {
      subdiscipline {
        ...SubdisciplineMutationFields
      }
      errors
      errorDetails
    }
  }

  mutation deleteDiscipline($id: ID!) {
    deleteDiscipline(id: $id) {
      discipline {
        ...DisciplineMutationFields
      }
      errors
      errorDetails
    }
  }
  ${disciplineMutationFields}
  ${subdisciplineMutationFields}
`
export type DisciplinesType = 'discipline' | 'subdiscipline'

type ItemType = DisciplineFieldsFragment | SubdisciplineFieldsFragment

type UpdateModalProps = {
  canDelete: boolean
  item: ItemType
  title: string
  selectedDiscipline?: DisciplineFieldsFragment
  setSelectedDisciplineId: Dispatch<SetStateAction<string | undefined>>
}

const UpdateModal: FC<UpdateModalProps> = ({
  canDelete,
  item,
  title,
  selectedDiscipline,
  setSelectedDisciplineId,
}) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [updateDiscipline] = useUpdateDisciplineMutation()
  const [updateSubdiscipline] = useUpdateSubdisciplineMutation()
  const [deleteDiscipline] = useDeleteDisciplineMutation()
  const [deleteSubdiscipline] = useDeleteSubdisciplineMutation()

  const { hideModal, showModal } = useModal()

  const { __typename, userCount } = item

  const type = (__typename || '').toLowerCase() as DisciplinesType

  const handleRename = async (values: any) => {
    const mutation =
      type === 'discipline' ? updateDiscipline : updateSubdiscipline

    if (type === 'subdiscipline' && selectedDiscipline?.id) {
      values.disciplineId = selectedDiscipline.id
    }

    const { id, itemCount, ...attributes } = values

    const { errors, data } = await mutation({
      variables: {
        id,
        values: attributes,
      },
    })

    if (errors || !data) {
      console.error('error:', errors)
    }

    hideModal()
  }

  const handleDelete = async (id: any) => {
    const mutation =
      type === 'discipline' ? deleteDiscipline : deleteSubdiscipline

    const { errors, data } = await mutation({
      variables: { id },
      refetchQueries: ['groupDisciplines'],
    })

    if (errors || !data) {
      console.error('error:', errors)
    }

    const deletedDiscipline = (data as DeleteDisciplineMutation)
      ?.deleteDiscipline?.discipline

    if (selectedDiscipline?.id === deletedDiscipline?.id) {
      setSelectedDisciplineId(undefined)
    }

    hideModal()
  }

  const label = (code: string) => {
    const id =
      currentGroup.languages.length > 1
        ? `form.name${upperFirst(code)}`
        : `form.name`
    return formatMessage({ id })
  }

  //@TODO pull this from disicpline info
  const allowDelete = userCount === 0 && canDelete

  return (
    <Form
      id={type}
      initialValues={pick(item, ['id', 'nameEn', 'nameFr'])}
      onSubmit={(values) => handleRename(values)}
      className="p-10"
    >
      {({ isSubmitting }: { isSubmitting: boolean }) => (
        <>
          <H3 className="">{title}</H3>
          {userCount > 0 && (
            <p className="mb-4">In use by {item.userCount} user(s)</p>
          )}
          {currentGroup.languages.map((lang) => (
            <Field
              key={lang.id}
              name={`name${upperFirst(lang.code)}`}
              label={label(lang.code)}
            />
          ))}
          <div className="flex justify-between">
            <Button loading={isSubmitting} type="submit" className="mb-1">
              {formatMessage({ id: 'term.update' })}
            </Button>
            {allowDelete && (
              <Button
                loading={isSubmitting}
                onClick={() =>
                  showModal({
                    content: (
                      <Confirm
                        onConfirm={() => handleDelete(item.id)}
                        onDecline={hideModal}
                        newModal={false}
                        title="Confirm delete"
                        question={`Are you sure you want to delete? ${
                          type === 'discipline' &&
                          !currentGroup.hasIndependentSubdisciplines
                            ? `This will remove all ${formatMessage({
                                id: 'term.subdisciplines',
                              })} related to ${selectedDiscipline?.name}.`
                            : ''
                        }`}
                      />
                    ),
                  })
                }
                color="red"
                className="mb-1"
              >
                {formatMessage({ id: 'term.delete' })}
              </Button>
            )}
          </div>
        </>
      )}
    </Form>
  )
}

export default UpdateModal
