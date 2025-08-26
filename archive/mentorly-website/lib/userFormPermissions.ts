import { getFeatureFlag } from 'components/Feature'
import {
  FlagResultType,
  FormPermissionType,
  ReadOnlyType,
} from 'config/features'

export const groupUserPermissionsForForm = (
  group: { slug: string },
  user: { mentor: boolean },
  formId: string
) => {
  const groupReadOnlyFields: FlagResultType = getFeatureFlag(
    group,
    'readOnlyFields',
    user
  ) as FormPermissionType

  const readOnlyFormFields: ReadOnlyType = groupReadOnlyFields[formId]

  const fields = readOnlyFormFields?.active
    ? readOnlyFormFields?.fields || []
    : []

  return {
    readOnlyFormFields: fields,
    hasReadOnly: fields.length > 0,
  }
}
