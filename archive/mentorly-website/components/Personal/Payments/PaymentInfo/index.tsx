import { gql } from '@apollo/client'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { StripeCardElementOptions } from '@stripe/stripe-js'
import Button from 'components/Button/Button'
import Panel from 'components/display/Panel'
import ErrorDetails from 'components/Error/ErrorDetails'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { H4 } from 'components/Headings'
import { getErrorMessage } from 'lib/error'
import { isEmpty } from 'lodash'
import { FC, ReactNode, useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCreateStripeCustomerMutation } from 'types/graphql'

// @TODO: move viewerStripInfo to page and remove from this and BankingInfo component

gql`
  mutation createStripeCustomer($token: String!) {
    createStripeCustomer(token: $token) {
      customer {
        cvcPassed
        expMonth
        expYear
        id
        lastFour
      }
      errorDetails
    }
  }
`

type CardElementContainerProps = {
  children: ReactNode
}

const CardElementContainer: FC<CardElementContainerProps> = ({ children }) => (
  <div className="p-3 border rounded border-mediumGray mt-3 flex-grow">
    {children}
  </div>
)

type StripeFormProps = {
  handleSave: () => void
  saving: boolean
  canSave: boolean
  cardElementOptions: StripeCardElementOptions
  handleChange: (event: any) => void
  mode: string
  setMode: (mode: string) => void
}

const StripeForm: FC<StripeFormProps> = ({
  handleSave,
  saving,
  canSave,
  cardElementOptions,
  handleChange,
  mode,
  setMode,
}) => {
  const { formatMessage } = useIntl()
  return (
    <div className="flex flex-col md:flex-row md:w-full md:items-end items-start mb-5">
      <div className="w-full mb-5 md:mb-0 flex items-center">
        <CardElementContainer>
          <CardElement options={cardElementOptions} onChange={handleChange} />
        </CardElementContainer>
        {mode !== 'unlockedNoCancel' && (
          <button
            color="gray"
            className="hover:opacity-50 cursor-pointer text-darkerGray ml-3 flex mt-2 w-12"
            onClick={() => setMode('locked')}
          >
            {formatMessage({ id: 'button.cancel' })}
          </button>
        )}
      </div>
      <Button
        className="md:ml-4"
        onClick={handleSave}
        loading={saving}
        disabled={saving || !canSave}
      >
        {formatMessage({ id: 'button.save' })}
      </Button>
    </div>
  )
}

type LockedPaymentInfoProps = {
  stripeCustomer: any
  setMode: (mode: string) => void
}

const LockedPaymentInfo: FC<LockedPaymentInfoProps> = ({
  stripeCustomer,
  setMode,
}) => {
  const { formatMessage } = useIntl()
  return (
    <div className="flex flex-col mt-5 md:flex-row md:w-full md:items-end items-start mb-5">
      <div className="border py-2 px-4 border-mediumGray rounded flex-grow text-darkerGray flex justify-between">
        <div style={{ margin: '1px 0' }}>
          •••• •••• •••• {stripeCustomer.lastFour}
        </div>
        <div style={{ margin: '1px 0' }}>
          {formatMessage({ id: 'term.expires' })}:{' '}
          {('0' + stripeCustomer.expMonth).slice(-2)}/
          {stripeCustomer.expYear.slice(-2)}
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

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#111',
      fontFamily: 'Mulish, sans-serif',
      '::placeholder': { color: '#a5a5ad' },
    },
    invalid: { color: '#e53e3e', iconColor: '#e53e3e' },
  },
  hidePostalCode: true,
}

type PaymentInfoProps = {
  stripeCustomer: any
}

const PaymentInfo: VFC<PaymentInfoProps> = ({ stripeCustomer }) => {
  const { formatMessage } = useIntl()

  const [createStripeCustomer] = useCreateStripeCustomerMutation({
    refetchQueries: ['viewerStripeInfo'],
  })
  const [saving, setSaving] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [mode, setMode] = useState('loading')

  useEffect(() => {
    if (stripeCustomer) {
      setMode('locked')
    } else if (stripeCustomer === null) {
      setMode('unlockedNoCancel')
    }
  }, [stripeCustomer])

  const handleChange = (event: any) => {
    if (event.complete) {
      setCanSave(true)
    } else if (event.error) {
      setCanSave(false)
    }
  }
  const stripe = useStripe()

  const elements = useElements()

  const handleSave = async () => {
    setSaving(true)

    const cardEl = elements?.getElement(CardElement)

    if (!stripe || !elements || !cardEl) {
      setSaving(false)
      return
    }

    try {
      const result = await stripe.createToken(cardEl)

      const token = result?.token?.id

      if (!token) {
        toast.error('Error fetching token')
        setSaving(false)
        return
      }

      try {
        const { data } = await createStripeCustomer({
          variables: { token },
        })

        const errorDetails = data?.createStripeCustomer.errorDetails

        if (!isEmpty(errorDetails)) {
          toast.error(<ErrorDetails errorDetails={errorDetails} />)
          setMode('unlockedNoCancel')
        } else {
          toast.success(formatMessage({ id: 'toast.success.submitted' }))
          setMode('loading')
        }

        setSaving(false)
      } catch (e) {
        setSaving(false)
        const message = getErrorMessage(e)
        console.error(message)
        toast.error('Error saving customer')
      }
    } catch (e) {
      toast.error('Error creating payment token')
      const message = getErrorMessage(e)
      console.error(message)
      setSaving(false)
    }
  }

  return (
    <Panel>
      <Panel.Body>
        <H4 className="">{formatMessage({ id: 'header.paymentInfo' })}</H4>
        <Alert type="subtle" showIcon className="mb-2">
          {formatMessage({ id: 'text.paymentInfo' })}
        </Alert>
        {mode === 'loading' ? (
          <Spinner />
        ) : mode === 'locked' ? (
          <LockedPaymentInfo
            stripeCustomer={stripeCustomer}
            setMode={setMode}
          />
        ) : (
          <StripeForm
            handleSave={handleSave}
            saving={saving}
            canSave={canSave}
            cardElementOptions={cardElementOptions}
            handleChange={handleChange}
            mode={mode}
            setMode={setMode}
          />
        )}
      </Panel.Body>
    </Panel>
  )
}

export default PaymentInfo
