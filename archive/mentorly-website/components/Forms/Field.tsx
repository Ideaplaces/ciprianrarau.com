import FieldError from 'components/controls/FieldError'
import ErrorBoundary from 'components/ErrorBoundary'
import Input from 'components/Input/Input'
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik'
import {
  Attributes,
  ComponentType,
  createElement,
  FC,
  isValidElement,
  ReactElement,
} from 'react'
import { useIntl } from 'react-intl'

type FieldComponentProps = {
  name: string
  type?: string
  control?: ReactElement
  compact?: boolean
  [x: string]: any
}

const Field: FC<FieldComponentProps> = ({
  name,
  type = 'text',
  control,
  compact,
  ...inputProps
}) => {
  const Control = (isValidElement(control) ? control : Input) as ComponentType
  const intl = useIntl()
  const label = intl.formatMessage({ id: `form.${name}` })

  return (
    <ErrorBoundary>
      <FormikField name={name}>
        {({ field, meta }: FormikFieldProps) => (
          <div className={compact ? 'mb-2' : 'mb-4'}>
            {!compact && (
              <label className="block mb-2 font-black">{label}</label>
            )}
            {createElement(Control, {
              placeholder: label,
              type,
              ...field,
              ...inputProps,
            } as Attributes)}
            {meta.touched && meta.error && <FieldError error={meta.error} />}
          </div>
        )}
      </FormikField>
    </ErrorBoundary>
  )
}

export default Field
