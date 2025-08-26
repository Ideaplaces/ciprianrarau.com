import { gql } from '@apollo/client'
import Button from 'components/Button'
import Checkbox from 'components/controls/CheckBox'
import DatePicker from 'components/controls/DatePicker'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Textarea from 'components/controls/Textarea'
import { detailsSchema } from 'components/Dashboard/schemas'
import Feature from 'components/Feature'
import RadioSelect from 'components/Select/RadioSelect'
import { FormikHelpers, FormikState, FormikValues } from 'formik'
import initialValues from 'lib/initialValues'
import { camelCase } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { GroupFormFieldsFragment, useUpdateGroupMutation } from 'types/graphql'

gql`
  mutation updateGroup($id: ID!, $attributes: GroupAttributes!) {
    updateGroup(id: $id, attributes: $attributes) {
      group: managedGroup {
        ...GroupFormFields
      }
      errors
      errorDetails
    }
  }

  fragment GroupFormFields on ManagedGroup {
    id
    slug
    name
    title
    subtitle
    aboutText
    startsAt
    endsAt
    enableCohorts
    menteeOnboarding
    menteesOnboardOn
    menteeMaxSessions
    mentorOnboarding
    mentorsOnboardOn
    mentorMaxSessions
    allowGroupSessions
    allowMasterclasses
    autoAcceptBookingRequests
    sessionLengths
    skipOnboarding
    autoMatching
    manualMatching
    whiteLabel
  }
`

type OptionType = {
  name: string
  value: any
}

const cohortOptions: OptionType[] = [
  { name: 'Enabled', value: true },
  { name: 'Disabled', value: false },
]

const lengthOptions: OptionType[] = [
  { name: '30 Minutes', value: [30] },
  { name: '60 Minutes', value: [60] },
  { name: 'Both', value: [30, 60] },
]

const onboardingOptions: OptionType[] = [
  { name: 'Manual', value: 'manual' },
  { name: 'Automatic', value: 'automatic' },
]

const localizedOptions = (
  options: OptionType[],
  formatMessage: (...args: any) => string
) => {
  return options.map((option) => {
    const term = option.name.replace(/ /g, '')
    return {
      ...option,
      name: `${formatMessage({ id: `term.${camelCase(term)}` })}`,
    }
  })
}

type GroupFormProps = {
  group: GroupFormFieldsFragment
}
const GroupForm: VFC<GroupFormProps> = ({ group }) => {
  const { formatMessage, locale } = useIntl()
  const [updateGroup] = useUpdateGroupMutation({
    refetchQueries: ['groupEssentials'],
  })

  const onSubmit = (data: FormikValues, formikBag: FormikHelpers<any>) => {
    updateGroup({
      variables: {
        id: group.id,
        attributes: data,
      },
    }).then(() => {
      formikBag.setSubmitting(false)
      toast.success('Saved!')
    })
  }

  const values = initialValues(
    group,
    [
      'name',
      'slug',
      'title',
      'subtitle',
      'aboutText',
      'startsAt',
      'endsAt',
      'enableCohorts',
      'menteeOnboarding',
      'menteesOnboardOn',
      'menteeMaxSessions',
      'mentorOnboarding',
      'mentorsOnboardOn',
      'mentorMaxSessions',
      'allowGroupSessions',
      'allowMasterclasses',
      'autoAcceptBookingRequests',
      'sessionLengths',
      'autoMatching',
      'manualMatching',
      'skipOnboarding',
    ],
    {
      menteeOnboarding: 'manual',
      mentorOnboarding: 'manual',
      enableCohorts: true,
    }
  )

  const localize = (options: OptionType[]) =>
    localizedOptions(options, formatMessage)

  const customDateFormat = `yyyy/MM/dd ${
    locale === 'en' ? `'at' h:mm aaa` : `à H'h'mm`
  }`

  const onboardingPending = (
    <p className="text-orange pb-3 italic -mt-3">
      {formatMessage({
        id: group.whiteLabel
          ? 'feature.coming_soon'
          : 'tooltip.upgradePlanForFeature',
      })}
    </p>
  )

  return (
    <Form
      id="program"
      initialValues={values}
      validationSchema={detailsSchema}
      onSubmit={onSubmit}
      showErrorSummary
    >
      {({ values, isSubmitting }: FormikState<FormikValues>) => (
        <div>
          <Field name="name" />
          <Field name="title" />
          <Field name="subtitle" control={Textarea} />
          <Field name="aboutText" control={Textarea} />
          <Field
            name="startsAt"
            control={DatePicker}
            minDate={new Date()}
            showTimeSelect
            customDateFormat={customDateFormat}
            placeholder={formatMessage({ id: 'util.selectDate' })}
          />
          <Field
            name="endsAt"
            control={DatePicker}
            showTimeSelect
            customDateFormat={customDateFormat}
            placeholder={formatMessage({ id: 'util.selectDate' })}
          />
          <Field
            name="enableCohorts"
            control={RadioSelect}
            options={localize(cohortOptions)}
          />
          <Field
            name="menteeOnboarding"
            control={RadioSelect}
            options={localize(onboardingOptions)}
            disabled={true || !group.whiteLabel} // for now disable always
            instructions={onboardingPending}
          />
          <Field
            name="menteesOnboardOn"
            hideLabel
            control={DatePicker}
            placeholder={formatMessage({ id: 'util.selectDate' })}
            disabled={values.menteeOnboarding !== 'automatic'}
          />
          <Field
            name="mentorOnboarding"
            control={RadioSelect}
            options={localize(onboardingOptions)}
            disabled={true || !group.whiteLabel} // for now disable always
            instructions={onboardingPending}
          />
          <Field
            name="mentorsOnboardOn"
            hideLabel
            control={DatePicker}
            placeholder={formatMessage({ id: 'util.selectDate' })}
            disabled={values.mentorOnboarding !== 'automatic'}
          />
          <div className="font-bold block mb-3">
            {formatMessage({ id: 'form.program.matchingType' })}
          </div>
          <Field
            type="checkbox"
            name="autoMatching"
            control={Checkbox}
            noBold
          />
          <Field
            type="checkbox"
            name="manualMatching"
            control={Checkbox}
            className="-mt-4"
            noBold
          />
          <Feature id="showAutoAcceptBookingsToggle">
            <Field
              type="checkbox"
              name="autoAcceptBookingRequests"
              control={Checkbox}
              label={formatMessage({ id: 'form.program.autoAccept' })}
              noBold
            />
          </Feature>

          <div className="font-bold block mb-3">
            {formatMessage({ id: 'form.program.allowedSessionTypes' })}
          </div>
          <Field
            type="checkbox"
            name="allowGroupSessions"
            control={Checkbox}
            label={formatMessage({
              id: 'form.program.allowGroupSessions.label',
            })}
            noBold
          />
          <Field
            type="checkbox"
            name="allowMasterclasses"
            control={Checkbox}
            className="-mt-4"
            label={formatMessage({
              id: 'form.program.allowMasterclasses.label',
            })}
            noBold
          />
          <Field
            type="number"
            name="sessionLengths"
            control={RadioSelect}
            options={localize(lengthOptions)}
          />
          <Field
            name="menteeMaxSessions"
            maxLength={3}
            className="max-w-xs"
            type="number"
            min={0}
          />
          <Field
            name="mentorMaxSessions"
            maxLength={3}
            className="max-w-xs"
            type="number"
            min={0}
          />
          <Field
            type="checkbox"
            name="skipOnboarding"
            control={Checkbox}
            noBold
          />

          <div className="pt-4">
            <Button loading={isSubmitting} type="submit">
              {formatMessage({ id: 'button.save' })}
            </Button>
          </div>
        </div>
      )}
    </Form>
  )
}

export default GroupForm
