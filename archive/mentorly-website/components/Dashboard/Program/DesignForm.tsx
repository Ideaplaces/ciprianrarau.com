import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Textarea from 'components/controls/Textarea'
import PortalPreviewer from 'components/Dashboard/PortalPreviewer'
import GroupStylesSelector from 'components/Dashboard/Program/GroupStyles'
import { designSchema } from 'components/Dashboard/schemas'
import Panel from 'components/display/Panel'
import { FormikHelpers, FormikState, FormikValues } from 'formik'
import { keys, omit, pick } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DesignFormFieldsFragment,
  DesignFormValuesFieldsFragment,
  GroupStylesFieldsFragment,
  GroupStylesFieldsFragmentDoc,
  PortalPreviewFieldsFragmentDoc,
  useUpdateGroupDesignMutation,
} from 'types/graphql'

gql`
  mutation updateGroupDesign($id: ID!, $attributes: GroupAttributes!) {
    updateGroup(id: $id, attributes: $attributes) {
      group: managedGroup {
        ...DesignFormFields
      }
      errors
      errorDetails
    }
  }

  fragment DesignFormFields on ManagedGroup {
    id
    ...DesignFormValuesFields
    ...PortalPreviewFields
  }
  fragment DesignFormValuesFields on ManagedGroup {
    title
    subtitle
    aboutText
    styles {
      ...GroupStylesFields
    }
  }
  ${PortalPreviewFieldsFragmentDoc}
  ${GroupStylesFieldsFragmentDoc}
`

type GroupFlatStylesType = Omit<DesignFormValuesFieldsFragment, 'styles'> &
  GroupStylesFieldsFragment

type DesignFormProps = {
  group: DesignFormFieldsFragment
  loading: boolean
}
const DesignForm: VFC<DesignFormProps> = ({ group, loading }) => {
  const [updateGroupDesign] = useUpdateGroupDesignMutation()
  const { formatMessage } = useIntl()

  if (!group) {
    console.error('could not find group')
    return null
  }

  const styles: Array<keyof GroupStylesFieldsFragment> = [
    'accentColor',
    'accentTextColor',
    'backgroundColor',
    'backgroundTextColor',
    'fontName',
    'titleFontName',
    'highlightColor',
  ]

  const flattenGroupStyles = (group: DesignFormValuesFieldsFragment) => ({
    ...omit(group, 'styles'),
    ...group?.styles,
  })

  const nestGroupStyles = (group: GroupFlatStylesType) => ({
    ...omit(group, styles),
    styles: pick(group, styles),
  })

  const initialValues = pick(
    flattenGroupStyles(group),
    keys(designSchema.fields)
  )

  const onSubmit = (
    data: FormikValues,
    formikBag: FormikHelpers<FormikValues>
  ) => {
    updateGroupDesign({
      variables: {
        id: group.id,
        attributes: nestGroupStyles(data),
      },
    }).then(() => {
      formikBag.setSubmitting(false)
      toast.success('Saved!')
    })
  }

  return (
    <div className="w-full">
      <Panel className="mb-4">
        <Panel.Body>
          <Form
            id="design"
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={designSchema}
            showErrorSummary
          >
            {({ isSubmitting, values }: FormikState<FormikValues>) => (
              <>
                <fieldset>
                  <Field name="title" />
                  <Field
                    name="subtitle"
                    label={formatMessage({ id: 'term.tagline' })}
                    control={Textarea}
                  />
                </fieldset>
                <Field name="aboutText" control={Textarea} />
                <div className="flex flex-col xl:flex-row justify-between">
                  <div id="colors-and-fonts" className="w-full xl:w-1/2">
                    <GroupStylesSelector />
                  </div>
                  <div
                    id="preview"
                    style={{ width: 360, height: 235 }}
                    className="relative my-auto"
                  >
                    <PortalPreviewer
                      previewValues={nestGroupStyles(values)}
                      loading={loading}
                    />
                  </div>
                </div>

                <div className="pt-4 flex">
                  <Button loading={isSubmitting} type="submit">
                    {formatMessage({ id: 'button.save' })}
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Panel.Body>
      </Panel>
    </div>
  )
}

export default DesignForm
