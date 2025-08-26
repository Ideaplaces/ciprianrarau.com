import { useMutation, useQuery } from '@apollo/client'
import Button, { ButtonLink } from 'components/Button'
import CheckBox from 'components/controls/CheckBox'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Select from 'components/controls/ReactSelect'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import Mutation from 'components/Graphql/Mutation'
import Result from 'components/Graphql/Result'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { FragmentType, graphql, useFragment } from 'src/gql'
import { boolean, number, object } from 'yup'

export const GroupPaymentFragment = graphql(/* GraphQL */ `
  fragment GroupPayment on Group {
    id
    paymentSettings {
      currency
      monthlySubscriptionAmount
      requiresPayment
      signUpFeeAmount
      useSignUpFee
      useSubscriptionFee
      yearlySubscriptionAmount
    }
    account {
      id
      inAppBilling
      stripeAccount {
        id
        accountLink
        dashboardLink
      }
    }
  }
`)

const stripeAccountQueryDocument = graphql(/* GraphQL */ `
  query stripeAccount($groupId: ID!) {
    group(id: $groupId) {
      ...GroupPayment
    }
  }
`)

const updatePaymentSettingsMutation = graphql(/* GraphQL */ `
  mutation updateGroupPaymentSettings(
    $id: ID!
    $attributes: GroupPaymentSettingsAttributes!
  ) {
    updateGroupPaymentSettings(id: $id, attributes: $attributes) {
      group: managedGroup {
        id
      }
    }
  }
`)

type SettingsFormProps = {
  group?: FragmentType<typeof GroupPaymentFragment> | null
}

type CurrencySelectProps = {
  name: string
  value?: string
  onValueChange: (...args: any) => void
}

const CurrencySelect: VFC<CurrencySelectProps> = ({
  name,
  value,
  onValueChange,
  ...props
}) => {
  const currencies = [
    { value: 'usd', label: 'US Dollar' },
    { value: 'cad', label: 'Canadian Dollar' },
  ]

  const findOption = (value?: string) => {
    return currencies.find((currency) => currency.value === value) || null
  }

  const handleChange = (option: any) => {
    onValueChange(option.value)
  }

  return (
    <Select
      {...props}
      value={findOption(value)}
      name={name}
      options={currencies}
      onChange={handleChange}
    />
  )
}

const settingsFormSchema = object({
  monthlySubscriptionAmount: number(),
  monthlySubscriptionEnabled: boolean(),
  requiresPayment: boolean(),
  signUpFeeAmount: number(),
  useSignUpFee: boolean(),
  useSubscriptionFee: boolean(),
  yearlySubscriptionAmount: number(),
})

const SettingsForm = (props: SettingsFormProps) => {
  const { formatMessage } = useIntl()
  const tuple = useMutation(updatePaymentSettingsMutation)

  const group = useFragment(GroupPaymentFragment, props.group)

  if (!group) {
    return null
  }

  const initialValues = {
    currency: group.paymentSettings?.currency ?? 'usd',
    monthlySubscriptionAmount:
      group.paymentSettings?.monthlySubscriptionAmount ?? 0,
    requiresPayment: group.paymentSettings?.requiresPayment ?? false,
    signUpFeeAmount: group.paymentSettings?.signUpFeeAmount ?? 0,
    useSignUpFee: group.paymentSettings?.useSignUpFee ?? false,
    useSubscriptionFee: group.paymentSettings?.useSubscriptionFee ?? false,
    yearlySubscriptionAmount:
      group.paymentSettings?.yearlySubscriptionAmount ?? 0,
  }

  return (
    <div className="space-y-4">
      <Mutation id={group.id} schema={settingsFormSchema} tuple={tuple}>
        {({ loading, onSubmit }) => (
          <Form
            id="monetizationSettings"
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={settingsFormSchema}
          >
            {() => (
              <>
                <Field
                  name="currency"
                  type="select"
                  control={CurrencySelect}
                  label={formatMessage({
                    id: 'form.monetizationSettings.currency',
                  })}
                />
                <Field
                  type="checkbox"
                  control={CheckBox}
                  name="requiresPayment"
                  label={formatMessage({
                    id: 'form.monetizationSettings.requiresPayment',
                  })}
                />
                <Field
                  type="checkbox"
                  control={CheckBox}
                  name="useSignUpFee"
                  label={formatMessage({
                    id: 'form.monetizationSettings.useSignUpFee',
                  })}
                />
                <Field name="signUpFeeAmount" type="number" />
                <Field
                  type="checkbox"
                  control={CheckBox}
                  name="useSubscriptionFee"
                  label={formatMessage({
                    id: 'form.monetizationSettings.useSubscriptionFee',
                  })}
                />
                <Field name="monthlySubscriptionAmount" type="number" />
                <Field name="yearlySubscriptionAmount" type="number" />
                <Button type="submit" disabled={loading}>
                  {formatMessage({ id: 'button.save' })}
                </Button>
                {loading && (
                  <p>{formatMessage({ id: 'form.processRequest' })}</p>
                )}
              </>
            )}
          </Form>
        )}
      </Mutation>
    </div>
  )
}

const StripeLinks = (props: SettingsFormProps) => {
  const group = useFragment(GroupPaymentFragment, props.group)
  const stripeAccount = group?.account?.stripeAccount
  const { formatMessage } = useIntl()

  return (
    <>
      {stripeAccount?.accountLink && (
        <ButtonLink href={stripeAccount?.accountLink} className="mr-4">
          {formatMessage({ id: 'setup.stripeAccount' })}
        </ButtonLink>
      )}
      {stripeAccount?.dashboardLink && (
        <ButtonLink href={stripeAccount?.dashboardLink}>
          {formatMessage({ id: 'setup.stripeDashboard' })}
        </ButtonLink>
      )}
    </>
  )
}

const Index = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const result = useQuery(stripeAccountQueryDocument, {
    variables: { groupId: currentGroup.id },
  })

  return (
    <Result result={result}>
      {({ group }) => {
        return (
          <div className=" max-w-4xl">
            <Heading>
              <Heading.Text>
                {formatMessage({ id: 'menu.monetization' })}
              </Heading.Text>
            </Heading>

            <Panel>
              <Panel.Header
                heading={formatMessage({ id: 'menu.stripeSettings' })}
                subheading={formatMessage({
                  id: 'menu.stripeSettings.subHeading',
                })}
              />
              <Panel.Body className="h-full drop-shadow-sm">
                <StripeLinks group={group} />
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Header>
                {formatMessage({ id: 'menu.paymentSettings' })}
              </Panel.Header>
              <Panel.Body className="h-full drop-shadow-sm">
                <SettingsForm group={group} />
              </Panel.Body>
            </Panel>
          </div>
        )
      }}
    </Result>
  )
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
