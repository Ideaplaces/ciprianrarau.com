import classNames from 'classnames'
import ConditionalWrapper from 'components/ConditionalWrapper'
import CopyToClipboard from 'components/CopyToClipboard/CopyToClipboard'
import Tooltip from 'components/display/Tooltip'
import ErrorBoundary from 'components/ErrorBoundary'
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik'
import { useCurrentGroup } from 'lib/GroupContext'
import { isRequiredField } from 'lib/isRequiredField'
import { useCurrentUser } from 'lib/UserContext'
import { groupUserPermissionsForForm } from 'lib/userFormPermissions'
import { last, startCase } from 'lodash'
import {
  CSSProperties,
  FC,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useContext,
  useMemo,
} from 'react'
import { Info } from 'react-feather'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

import FieldError from './FieldError'
import { FormContext } from './Form'
import Input from './Input'

const fieldLabel = ({ formId = '', name = '' }) => {
  const shortName = last(name.split('.'))

  return [
    `form.${formId}.${shortName}`,
    `form.${shortName}`,
    `term.${shortName}`,
  ]
}

type ChildType = {
  children: ReactNode
}

const formatText = (text: ReactNode) => {
  if (!text) {
    return null
  }

  if (typeof text !== 'string') {
    return text
  }

  return text
    .toString()
    .split('\n')
    .map((item, key) => (
      <p className="mb-2" key={key}>
        {item}
      </p>
    ))
}

const HelpText: FC<ReactNode> = ({ children }) => {
  if (!children) {
    return null
  }
  return (
    <div className="mt-2 text-darkerGray text-sm">{formatText(children)}</div>
  )
}

export const Label: FC<ChildType> = ({ children }) => {
  return <label className="flex items-center mb-2 font-bold">{children}</label>
}

type FieldProps = {
  name: string
  testId?: string
  label?: Maybe<string>
  type?: string
  className?: string
  controlClassName?: string
  controlStyle?: CSSProperties
  control?: any
  hidden?: boolean
  hideLabel?: boolean
  instructions?: ReactNode
  placeholder?: string
  customChangeHandler?: (event: any) => void
  strip?: boolean | RegExp
  copyaple?: boolean
  isSocialURL?: boolean
  ref?: ForwardedRef<any>
  [key: string]: any
}

const formatURL = (value: string) => {
  return value.startsWith('www') ? 'https://' + value : value
}

const stripValue = (text: string, remove: RegExp | boolean) => {
  const regExp = typeof remove === 'boolean' ? /\s/g : remove
  const regex = new RegExp(regExp)
  return text.replace(regex, '')
}

const Field: FC<FieldProps> = forwardRef(
  (
    {
      name,
      testId,
      label,
      type = 'text',
      className,
      controlClassName,
      controlStyle,
      control,
      hidden,
      hideLabel,
      instructions,
      placeholder,
      customChangeHandler,
      strip,
      copyable,
      tooltipProps,
      isSocialURL,
      defaultPlaceholder,
      ...inputProps
    },
    ref
  ) => {
    const Control = control || Input
    // @TODO: DRY up logic repeated here and in Filters
    const { formatMessage, messages } = useIntl()
    const { currentGroup } = useCurrentGroup()
    const { currentUser }: any = useCurrentUser()
    const { id: formId, validationSchema } = useContext(FormContext)
    const [messageId, shortMessageId, termId] = fieldLabel({ formId, name })
    const helpMessageId = `${messageId}.help`
    const tooltipId = `${messageId}.tooltip`
    const placeholderId = `${messageId}.placeholder`

    const asterisk = useMemo(
      () =>
        isRequiredField(validationSchema, name) && (
          <span className="text-red ml-1">*</span>
        ),
      [validationSchema]
    )

    const message = [
      messages[messageId],
      messages[shortMessageId],
      messages[termId],
    ].filter(Boolean)

    const labelText =
      label ||
      message[0] ||
      formatMessage({ id: name, defaultMessage: startCase(name) })

    const helpText =
      messages[helpMessageId] &&
      formatMessage({
        id: helpMessageId,
      })

    const tooltipText =
      messages[tooltipId] &&
      formatMessage(
        {
          id: tooltipId,
        },
        tooltipProps
      )

    const getPlaceholderText = () => {
      if (placeholder) return placeholder
      if (messages[placeholderId]) {
        return formatMessage({
          id: placeholderId,
        })
      }
      if (defaultPlaceholder) {
        return formatMessage(
          { id: 'field.placeholder.default' },
          { field: String(labelText).toLowerCase() }
        )
      }
    }

    const helpTooltip = tooltipText ? (
      <Tooltip text={<div className="max-w-md text-left">{tooltipText}</div>}>
        <Info
          className="text-darkerGray ml-2 opacity-75 hover:opacity-100"
          size={20}
        />
      </Tooltip>
    ) : null

    const { readOnlyFormFields } =
      currentGroup && currentUser
        ? groupUserPermissionsForForm(currentGroup, currentUser, formId)
        : { readOnlyFormFields: [''] }

    return (
      <ErrorBoundary>
        <FormikField name={name}>
          {({ field, form, meta }: FormikFieldProps) => {
            const { setFieldValue } = form

            const disabled = readOnlyFormFields.includes(field.name)

            const handleValueChange = (value: string) => {
              value = isSocialURL ? formatURL(value) : value
              setFieldValue(name, strip ? stripValue(value, strip) : value)
              customChangeHandler && customChangeHandler(value)
            }

            return (
              <div className={classNames(className, 'mb-6', { hidden })}>
                {!hideLabel && type !== 'checkbox' && (
                  <Label>
                    <div>
                      {labelText}
                      {asterisk}
                    </div>
                    {helpTooltip}
                  </Label>
                )}
                {instructions && <HelpText>{instructions}</HelpText>}
                <ConditionalWrapper
                  wrapper={(children: any) => (
                    <div className="flex items-center test">{children}</div>
                  )}
                  condition={(hideLabel && helpTooltip) || copyable}
                >
                  <ErrorBoundary>
                    <Control
                      disabled={disabled}
                      border={!inputProps.borderless}
                      label={hideLabel ? undefined : labelText}
                      type={type}
                      data-testid={testId || name}
                      ref={ref}
                      placeholder={getPlaceholderText()}
                      onValueChange={handleValueChange}
                      className={classNames(
                        controlClassName,
                        disabled &&
                          'text-darkGray bg-gray opacity-60 !pointer-events-none'
                      )}
                      style={controlStyle}
                      {...field}
                      {...inputProps}
                    />
                    {copyable && (
                      <Copier copyable={copyable} value={field.value} />
                    )}
                  </ErrorBoundary>
                  {hideLabel ? (
                    <div className="ml-1">{helpTooltip}</div>
                  ) : (
                    <></>
                  )}
                </ConditionalWrapper>
                {meta.touched && meta.error && (
                  <FieldError error={meta.error} />
                )}

                {helpText && <HelpText>{helpText}</HelpText>}
              </div>
            )
          }}
        </FormikField>
      </ErrorBoundary>
    )
  }
)

Field.displayName = 'Field'

const Copier = ({ copyable, value }: Partial<FieldProps>) => {
  const { formatMessage } = useIntl()
  const textToCopy = typeof copyable === 'string' ? copyable : value
  return (
    <div className="ml-2">
      <CopyToClipboard string={textToCopy}>
        <span>{formatMessage({ id: 'term.copy' })}</span>
      </CopyToClipboard>
    </div>
  )
}

export default Field
