import { ApolloError } from '@apollo/client'
import { RefetchQueriesFunction } from '@apollo/client/react/types/types'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import CheckBox from 'components/Input/CheckBox'
import { useCurrentGroup } from 'lib/GroupContext'
import initialValues from 'lib/initialValues'
import { isEmpty, omit, startCase } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  Tag,
  TagAttributes,
  useCreateTagMutation,
  useUpdateTagMutation,
} from 'types/graphql'

type TagFormPopupProps = {
  tag?: Tag
  closeModal: (props?: any) => void
  refetch: RefetchQueriesFunction
}

const TagFormPopup: FC<TagFormPopupProps> = ({ tag, closeModal, refetch }) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const values = omit(tag, 'name', 'key')

  const afterMutationAction = {
    // checks for an Apollo error
    onError: (error: ApolloError) => {
      toast.error(formatMessage({ id: 'form.error' }))
      console.error(error)
    },
    onCompleted: (props: any) => {
      // check for error details from BE
      const error =
        props?.createTag?.errorDetails || props?.updateTag?.errorDetails
      if (error) {
        return Object.keys(error).map((err) => {
          toast.error(error[err][0].error)
        })
      } else {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        refetch()
      }
    },
  }

  const [updateTag] = useUpdateTagMutation(afterMutationAction)
  const [createTag] = useCreateTagMutation(afterMutationAction)

  const handleSubmit = (attributes: TagAttributes) => {
    const hasEn = currentGroup.languages.some((lang) => lang['id'] === 'en')
    const hasFr = currentGroup.languages.some((lang) => lang['id'] === 'fr')
    if (
      isEmpty(attributes) ||
      (hasEn && isEmpty(attributes.nameEn)) ||
      (hasFr && isEmpty(attributes.nameFr))
    ) {
      toast.error(formatMessage({ id: 'form.empty' }))
      return
    }
    if (tag?.id) {
      updateTag({ variables: { id: tag.id, attributes } })
    } else {
      createTag({ variables: { groupId: currentGroup.id, attributes } })
    }
    closeModal()
  }

  if (!currentGroup.languages) {
    return null
  }

  return (
    <Form
      id="tagGroup"
      initialValues={initialValues(values)}
      onSubmit={handleSubmit}
    >
      {() => (
        <div className="p-8">
          {currentGroup.languages.map((lang) => (
            <Field
              key={lang.id}
              name={`name${startCase(lang.id)}`}
              autoComplete="off"
              placeholder={formatMessage({ id: 'form.newTag' })}
            />
          ))}
          <div className="flex mb-4">
            <Field
              name="isPublic"
              type="checkbox"
              control={CheckBox}
              className="w-1/2"
            />
            <Field
              name="isFiltering"
              type="checkbox"
              control={CheckBox}
              className="w-1/2"
            />
          </div>
          <Button type="submit">
            {formatMessage({ id: `button.${tag ? 'edit' : 'add'}` })}
          </Button>
        </div>
      )}
    </Form>
  )
}

export default TagFormPopup
