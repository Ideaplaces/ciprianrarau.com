import Alert from 'components/feedback/Alert'
import {
  Form as FormikForm,
  Formik,
  FormikConfig,
  FormikProps,
  FormikValues,
} from 'formik'
import { useCheckDirty } from 'lib/hooks/useCheckDirty'
import { isEmpty } from 'lodash'
import {
  createContext,
  FC,
  forwardRef,
  ReactElement,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
  VFC,
} from 'react'
import { useIntl } from 'react-intl'

type FieldNames = Record<string, string | null | undefined>

type FormContextProps = {
  id: string
  validationSchema?: any
}

export const FormContext = createContext<FormContextProps>({
  id: 'form',
  validationSchema: undefined,
})

export const Errors: VFC<any> = forwardRef(
  ({ errors, fieldNames = {} }, ref: Ref<HTMLDivElement>) => {
    const { formatMessage } = useIntl()
    const formErrors = Object.keys(errors)

    useEffect(() => {
      const errorDiv = (ref as RefObject<HTMLDivElement>)?.current
      errorDiv?.scrollIntoView()
    }, [])

    if (isEmpty(formErrors)) return null

    return (
      <div ref={ref} className="block py-4">
        <Alert type="error" className="mb-4" showIcon>
          {formatMessage({ id: 'util.requiredMulti' })}
          <ul className="list-disc pl-6">
            {formErrors.map((e) => (
              <li key={e}>
                {fieldNames[e] || formatMessage({ id: `form.${e}` })}
              </li>
            ))}
          </ul>
        </Alert>
      </div>
    )
  }
)

Errors.displayName = 'FormErrors'

//TODO this is a bit of a hack until we refactor filter forms (that don't use onSubmit)
export const FilterForm: VFC<any> = (props) => {
  return <Form {...props} />
}

export type FormProps = FormikConfig<FormikValues> & {
  children: (props?: any) => ReactElement
  className?: string
  confirmUnsaved?: boolean
  id: string
  onSubmit: (...args: any) => void
  showErrorSummary?: boolean
  fieldNames?: FieldNames
}

type FormContentProps = Omit<FormProps, 'onSubmit'> &
  Pick<FormikProps<FormikValues>, 'dirty' | 'errors' | 'handleSubmit'>

const FormContent: VFC<FormContentProps> = ({
  children,
  className,
  confirmUnsaved,
  dirty,
  handleSubmit,
  id,
  showErrorSummary = false,
  fieldNames,
  ...props
}) => {
  const { setUnsaved } = useCheckDirty()
  const [showErrors, setShowErrors] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    confirmUnsaved && setUnsaved(dirty)
  })

  return (
    <FormikForm
      className={className}
      onSubmit={(values) => {
        if (props.errors) {
          setShowErrors(showErrorSummary)
          ref?.current?.scrollIntoView()
        }
        handleSubmit(values)
      }}
      data-testid={id}
    >
      {showErrors && (
        <Errors errors={props.errors} fieldNames={fieldNames} ref={ref} />
      )}
      {children(props)}
    </FormikForm>
  )
}

export const Form: FC<FormProps> = ({
  id,
  children,
  validationSchema,
  showErrorSummary = false,
  confirmUnsaved = false,
  className,
  fieldNames = {},
  ...formikProps
}) => {
  return (
    <FormContext.Provider value={{ id, validationSchema }}>
      <Formik {...formikProps} validationSchema={validationSchema}>
        {(props) => {
          // @TODO: might make more sense to show errors above the submit button?
          return (
            <FormContent
              className={className}
              confirmUnsaved={confirmUnsaved}
              id={id}
              showErrorSummary={showErrorSummary}
              fieldNames={fieldNames}
              {...props}
            >
              {children}
            </FormContent>
          )
        }}
      </Formik>
    </FormContext.Provider>
  )
}

export default Form
