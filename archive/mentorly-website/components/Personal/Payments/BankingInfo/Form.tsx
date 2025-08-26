import Button from 'components/Button/Button'
import DatePicker from 'components/controls/DatePicker'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import StateSelect from 'components/controls/StateSelect'
import StripeCountrySelect from 'components/controls/StripeCountrySelect'
import { FormikProps } from 'formik'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import { ModeType } from '.'
import RoutingNumberField from './RoutingNumberField'

export type BankFormProps = {
  handleSubmit: (values?: any) => void
  validationSchema?: any
  submitting: boolean
  mode: ModeType
  setMode: (mode: ModeType) => void
}

export type FormValues = {
  accountHolderType: 'individual'
  dateOfBirth: string
  currency: string
  country?: Record<string, any>
  state?: Record<string, any>
  personalIdNumber?: string
  city: string
  address: string
  postalCode: string
  phone: string
  url: string
}

const BankForm: VFC<BankFormProps> = ({
  handleSubmit,
  validationSchema,
  submitting,
  mode,
  setMode,
}) => {
  const { formatMessage } = useIntl()

  const initialValues = {
    accountHolderType: 'individual',
    dateOfBirth: '',
    currency: '',
    city: '',
    address: '',
    phone: '',
    url: '',
  }

  return (
    <Form
      id="stripeBankAccount"
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {({ values, setFieldValue }: FormikProps<FormValues>) => {
        const requirePersonalId = values?.country?.value?.personal_id_number
        const requireAccountNumber = values?.country?.value?.account_number
        const requireRoutingNumber = values?.country?.value?.routing_number

        return (
          <>
            <div className="md:flex md:mr-4">
              <Field
                name="phone"
                label={formatMessage({ id: 'form.phone' })}
                className="md:mr-4 md:min-w-1/2"
              />
              <Field
                name="url"
                label={formatMessage({ id: 'form.website' })}
                className="md:min-w-1/2"
              />
            </div>
            <div className="md:flex md:mr-4">
              <Field
                name="dateOfBirth"
                type="date"
                control={DatePicker}
                className="md:min-w-1/2 md:mr-4"
                adultBirthDate
                full
              />
              <Field name="address" className="md:min-w-1/2" />
            </div>

            <div className="md:flex md:mr-4">
              <Field name="city" className="md:mr-4 md:min-w-1/2" />
              <Field name="postalCode" className="md:min-w-1/2" />
            </div>
            <div className="md:flex md:mr-4">
              <Field
                name="country"
                className="md:mr-4 md:min-w-1/2"
                control={StripeCountrySelect}
                customChangeHandler={() => {
                  setFieldValue('state', null)
                  setFieldValue('personalIdNumber', '')
                  setFieldValue('accountNumber', '')
                  setFieldValue('routingNumber', '')
                }}
              />
              <Field
                name="state"
                className="md:min-w-1/2"
                control={StateSelect}
                country={values.country}
              />
            </div>

            {requireRoutingNumber && (
              <RoutingNumberField
                data={values?.country?.value.routing_number}
                onChange={(value: string) =>
                  setFieldValue('routingNumber', value)
                }
              />
            )}
            {requireAccountNumber && (
              <Field
                name="accountNumber"
                label={formatMessage({
                  id: `stripe.${values?.country?.value?.account_number?.id}`,
                })}
                placeholder={values?.country?.value?.account_number?.example}
              />
            )}
            {requirePersonalId && (
              <Field
                name="personalIdNumber"
                label={formatMessage({
                  id: `stripe.${values?.country?.value?.personal_id_number?.id}`,
                })}
                placeholder={
                  values?.country?.value?.personal_id_number?.example
                }
              />
            )}

            <Field name="accountHolderType" hidden />

            <div className="w-full mb-5 md:mb-0 flex">
              <Button type="submit" loading={submitting} disabled={submitting}>
                {formatMessage({ id: 'button.save' })}
              </Button>
              {mode !== 'unlockedNoCancel' && (
                <button
                  color="gray"
                  className="hover:opacity-50 cursor-pointer
                    text-darkerGray ml-4"
                  onClick={() => setMode('locked')}
                >
                  {formatMessage({ id: 'button.cancel' })}
                </button>
              )}
            </div>
          </>
        )
      }}
    </Form>
  )
}

export default BankForm
