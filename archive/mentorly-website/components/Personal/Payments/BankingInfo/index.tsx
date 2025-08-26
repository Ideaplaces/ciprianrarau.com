import { gql } from '@apollo/client'
import { useStripe } from '@stripe/react-stripe-js'
import { Stripe } from '@stripe/stripe-js'
import Button from 'components/Button/Button'
import Panel from 'components/display/Panel'
import Alert from 'components/feedback/Alert'
import { H4 } from 'components/Headings'
import { mapKeys, pick, pickBy, snakeCase } from 'lodash'
import { useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Maybe, useCreateStripeAccountMutation } from 'types/graphql'

// @TODO: move viewerStripInfo to page and remove from this and PaymentInfo component
import BankForm, { FormValues } from './Form'
import { bankAccountSchema } from './schema'

gql`
  mutation createStripeAccount($attributes: StripeAccountCreateAttributes!) {
    createStripeAccount(attributes: $attributes) {
      account {
        id
        deleted
      }
      errorDetails
      errors
    }
  }
`

export type ModeType = 'unlockedNoCancel' | 'locked' | 'unlocked'

type LockedBankInfoProps = {
  setMode: (mode: ModeType) => void
}

const LockedBankInfo: VFC<LockedBankInfoProps> = ({ setMode }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="flex flex-col mt-5 md:flex-row md:w-full md:items-end items-start mb-5">
      <div className="border py-2 px-4 border-mediumGray rounded flex-grow text-darkerGray flex justify-between">
        <div style={{ margin: '1px 0' }}>
          {formatMessage({ id: 'stripe.bankAccountSaved' })}
        </div>
      </div>
      <Button
        className="md:ml-8"
        variant="secondary"
        onClick={() => setMode('unlocked')}
      >
        {formatMessage({ id: 'button.edit' })}
      </Button>
    </div>
  )
}

const getIdentityToken = async (
  stripe: Maybe<Stripe>,
  personalIdNumber?: string
) => {
  if (!personalIdNumber) {
    return { token: null, error: null }
  }

  const identityVariables = {
    personal_id_number: personalIdNumber,
  }

  const result = await stripe?.createToken('pii', identityVariables)

  return result
}

type BankingInfoProps = {
  user: {
    stripeAccount?: Maybe<{
      id: string
    }>
    stripeAccountLink?: Maybe<string>
  }
}

const BankingInfo: VFC<BankingInfoProps> = ({ user }) => {
  const { formatMessage } = useIntl()
  const [createStripeAccount] = useCreateStripeAccountMutation()
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<ModeType>('unlockedNoCancel')
  const stripe = useStripe()

  const { stripeAccount, stripeAccountLink } = user

  const stripeAccountId = stripeAccount?.id

  useEffect(() => {
    if (stripeAccountId) {
      setMode('locked')
    } else if (stripeAccountId === null) {
      setMode('unlockedNoCancel')
    }
  }, [stripeAccountId])

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true)

    const mustProvideID = !!values?.country?.value?.personal_id_number

    const formattedValues = {
      ...values,
      country: values?.country?.value.code,
      state: values?.country?.value.validWithoutProvince
        ? null
        : values?.state?.value,
      currency: values?.country?.value.currency,
    }

    const bankAccountVariables = pick(
      mapKeys(formattedValues, (_, k) => snakeCase(k)),
      [
        'country',
        'currency',
        'routing_number',
        'account_number',
        'account_holder_name',
        'account_holder_type',
      ]
    )

    const nonNullBankAccountVariables = pickBy(bankAccountVariables, (v) => v)

    const { token: identityToken, error: identityTokenError } =
      (await getIdentityToken(
        stripe,
        mustProvideID ? values.personalIdNumber : undefined
      )) || {}

    const { token: bankAccountToken, error: bankAccountTokenError } =
      (await stripe?.createToken(
        // @ts-expect-error: there are multiple createToken functions in stripe.d.ts
        'bank_account',
        nonNullBankAccountVariables
      )) || {}

    if (bankAccountToken) {
      const mutationVariables = {
        ...pick(formattedValues, [
          'country',
          'city',
          'state',
          'postalCode',
          'address',
          'dateOfBirth',
          'phone',
          'url',
        ]),
        bankTokenId: bankAccountToken.id,
        identityTokenId: identityToken ? identityToken.id : undefined,
      }

      createStripeAccount({ variables: { attributes: mutationVariables } })
        .then((response) => {
          setSubmitting(false)
          if (response?.data?.createStripeAccount.errorDetails) {
            toast.error(response.data.createStripeAccount.errorDetails.message)
          } else {
            toast.success(formatMessage({ id: 'toast.success.submitted' }))
            setSubmitting(false)
            setMode('locked')
          }
        })
        .catch((err) => {
          toast.error(err.message)
          console.error('mutationErr', err.message)
          setSubmitting(false)
        })
    }
    if (bankAccountTokenError) {
      console.error('stripeErr', bankAccountTokenError.message)
      toast.error(bankAccountTokenError.message)
      setSubmitting(false)
    }

    if (identityTokenError) {
      console.error('identityTokenErr', identityTokenError.message)
      toast.error(identityTokenError.message)
      setSubmitting(false)
    }
  }

  return (
    <Panel>
      <Panel.Body>
        <H4>{formatMessage({ id: 'header.bankingInfo' })}</H4>
        <Alert type="subtle" showIcon className="mb-5">
          {formatMessage({ id: 'text.bankingInfo' })}
        </Alert>
        {stripeAccountLink && (
          <div>
            <a href={stripeAccountLink} className="underline">
              Update your account info
            </a>
          </div>
        )}
        {mode === 'locked' ? (
          <LockedBankInfo setMode={setMode} />
        ) : (
          <BankForm
            handleSubmit={handleSubmit}
            validationSchema={bankAccountSchema}
            submitting={submitting}
            mode={mode}
            setMode={setMode}
          />
        )}
      </Panel.Body>
    </Panel>
  )
}

export default BankingInfo
