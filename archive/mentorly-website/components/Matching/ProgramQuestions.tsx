import { gql } from '@apollo/client'
import Button from 'components/Button/Button'
import ConsentSelect from 'components/controls/ConsentSelect'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Input from 'components/controls/Input'
import LanguageSelect from 'components/controls/LanguageSelect'
import Select, { SelectProps } from 'components/controls/Select'
import Textarea from 'components/controls/Textarea'
import TimezoneSelect from 'components/controls/TimezoneSelect'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import FormHeader from 'components/Onboarding/FormHeader'
import RadioSelect from 'components/Select/RadioSelect'
import { FormikHelpers, FormikValues } from 'formik'
import { formatSurveyMutationVariables } from 'lib/formatMutationVariables'
import { surveyInitialValues } from 'lib/initialValues'
import { startUrl } from 'lib/urls'
import { filter, isEmpty, keyBy, mapValues } from 'lodash'
import { event } from 'nextjs-google-analytics'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  CurrentUserProgramQuestionFieldsFragment,
  Maybe,
  SurveyQuestion,
  useCreateSurveyResultMutation,
  UserProgramQuestionFieldsFragment,
  UserTypeEnum,
  useSurveyQuestionsQuery,
} from 'types/graphql'
import * as Yup from 'yup'

type SurveyQuestionType = Omit<SurveyQuestion, 'id'>

gql`
  mutation createSurveyResult($userId: ID!, $data: JSON!) {
    createSurveyResult(data: $data, userId: $userId) {
      user {
        id
      }
      errors
    }
  }

  query surveyQuestions(
    $userType: UserTypeEnum!
    $locale: String
    $groupId: ID
  ) {
    group(id: $groupId) {
      id
      consentText(format: "html", locale: $locale)
      requiresPayment
      slug
      surveyQuestions {
        key
        position
        question(userType: $userType, locale: $locale)
        questionType
        choiceLimit(userType: $userType)
        instructions(locale: $locale)
        answers(locale: $locale)
        required
      }
    }
  }

  fragment CurrentUserProgramQuestionFields on CurrentUser {
    id
    mentor
    group {
      id
    }
    surveyResult {
      id
      data
    }
    onboardingPercent
  }
  fragment UserProgramQuestionFields on ManagedUser {
    id
    mentor
    group {
      id
    }
    surveyResult {
      id
      data
    }
    onboardingPercent
  }
`

type MatchingForm = {
  page?: string
  noMatching?: boolean
  onSubmit?: (...args: any) => void
  step: number
  formKey: string
  user?: Maybe<
    UserProgramQuestionFieldsFragment | CurrentUserProgramQuestionFieldsFragment
  >
  goPrev: () => void
  mentor?: boolean
}

const makeOptions = (answers?: Maybe<string[]>) => {
  return answers
    ?.filter((answer) => answer)
    ?.map((answer) => ({
      label: answer,
      name: answer,
      value: answer,
    }))
}

const MatchingForm: VFC<MatchingForm> = ({
  page,
  user,
  noMatching,
  onSubmit,
  goPrev,
  step,
  formKey,
  mentor,
}) => {
  const { locale } = useIntl()
  const { formatMessage } = useIntl()

  const {
    data: surveyData,
    error,
    loading,
  } = useSurveyQuestionsQuery({
    variables: {
      locale,
      userType: mentor ? UserTypeEnum.Mentor : UserTypeEnum.Mentee,
      groupId: user?.group?.id,
    },
  })

  const [createSurveyResult] = useCreateSurveyResultMutation()

  if (error) {
    return (
      <Alert title="Error" description={error.message} type="error" showIcon />
    )
  }

  if (loading || !user || !surveyData?.group) {
    return <Spinner />
  }

  const group = surveyData.group
  const surveyQuestions = filter(
    surveyData.group.surveyQuestions,
    (q) => !!q.question
  )
  const surveyResult = user?.surveyResult?.data
  const surveyQuestionsObj = keyBy(surveyQuestions, 'key')
  const fieldNames = mapValues(surveyQuestionsObj, (q) => q.question)
  const initialValues = surveyInitialValues(surveyQuestions, surveyResult)
  const validationSchema = Yup.object().shape(
    mapValues(surveyQuestionsObj, (v) => {
      if (v.questionType == 'consent') {
        return Yup.boolean().default(false).equals([true], 'doit etre accepte')
      } else {
        return v.required
          ? Yup.string().nullable().required()
          : Yup.string().nullable()
      }
    })
  )

  const handleSubmit = async (
    values: FormikValues,
    formikBag: FormikHelpers<FormikValues>
  ) => {
    try {
      await createSurveyResult({
        variables: {
          data: formatSurveyMutationVariables(values),
          userId: user.id,
        },
      })

      if (page === 'onboarding') {
        event('Onboarding Completed', {
          category: 'Onboarding',
          label: `completed_onboarding_step_4`,
          // userId: user?.id,
        })

        toast.success(formatMessage({ id: 'toast.success.submitted' }))

        window.location.href = startUrl(locale, group)
      }

      formikBag.setSubmitting(false)
      onSubmit && onSubmit()
    } catch (err: any) {
      toast.error(err)
    }
  }

  const SubmitSection = ({ isSubmitting }: FormikValues) => {
    const { formatMessage } = useIntl()

    if (page === 'onboarding') {
      return (
        <div className="flex my-3 justify-between">
          {goPrev && (
            <Button onClick={goPrev} variant="secondary">
              {formatMessage({ id: 'button.back' })}
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {formatMessage({ id: 'button.submit' })}
          </Button>
        </div>
      )
    }
    return (
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-5/12 mx-1"
      >
        {formatMessage({ id: 'button.submit' })}
      </Button>
    )
  }

  const headerKey = noMatching ? 'programQuestions' : formKey

  return (
    <>
      {page === 'onboarding' && <FormHeader step={step} formKey={headerKey} />}
      <Form
        id="programQuestions"
        initialValues={initialValues}
        fieldNames={fieldNames}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        showErrorSummary
      >
        {({ isSubmitting }: FormikValues) => (
          <>
            <FormContent surveyQuestions={surveyQuestions} />
            {page === 'onboarding' && group.consentText && (
              <div
                className="text-darkerGray text-sm rich-text"
                dangerouslySetInnerHTML={{ __html: group.consentText }}
              />
            )}
            <div className="pt-10">
              <SubmitSection isSubmitting={isSubmitting} />
            </div>
          </>
        )}
      </Form>
    </>
  )
}

const FormContent = ({
  surveyQuestions,
}: {
  surveyQuestions: SurveyQuestionType[]
}) => {
  const { formatMessage } = useIntl()

  if (!surveyQuestions || isEmpty(surveyQuestions)) {
    return (
      <p className="p-2 mb-6 italic opacity-60">
        There are no survey questions yet for this program. Check the matching
        section of your personal dashboard for updates.
      </p>
    )
  }

  return (
    <>
      {surveyQuestions.map(
        ({
          key,
          question,
          questionType,
          answers,
          instructions,
          choiceLimit,
        }) => {
          if (!question) {
            return null
          }

          if (questionType === 'consent') {
            return (
              <Field
                key={key}
                label={question}
                name={key}
                instructions={instructions}
                control={ConsentSelect}
                options={makeOptions(answers)}
              />
            )
          }

          if (questionType === 'location') {
            return (
              <Field
                key={key}
                name="city"
                label={question}
                instructions={instructions}
              />
            )
          }

          if (questionType === 'language') {
            return (
              <Field
                key={key}
                name="language"
                label={question}
                isMulti
                control={LanguageSelect}
                instructions={instructions}
              />
            )
          }
          if (questionType === 'time_zone') {
            return (
              <Field
                key={key}
                label={question}
                name="time_zone"
                control={TimezoneSelect}
              />
            )
          }
          if (questionType === 'preferred_language') {
            return (
              <Field
                key={key}
                label={question}
                name="preferred_language"
                type="select"
                mainOnly
                control={LanguageSelect}
                instructions={instructions}
              />
            )
          }
          if (questionType === 'radio') {
            return (
              <Field
                key={key}
                label={question}
                name={key}
                control={RadioSelect}
                options={makeOptions(answers)}
                instructions={instructions}
              />
            )
          }
          if (questionType === 'text') {
            return (
              <Field
                key={key}
                label={question}
                name={key}
                instructions={instructions}
                control={Textarea}
              />
            )
          }
          if (['select', 'choice'].includes(questionType)) {
            return (
              <Field
                key={key}
                label={question}
                name={key}
                control={(props: SelectProps<boolean>) => (
                  <Select
                    isMulti={questionType === 'select'}
                    maxOptions={choiceLimit || undefined}
                    {...props}
                  />
                )}
                options={makeOptions(answers)}
                instructions={instructions}
                placeholder={formatMessage({
                  id: 'field.placeholder.select',
                })}
              />
            )
          } else {
            return (
              <Field
                key={key}
                label={question}
                name={key}
                instructions={instructions}
                control={Input}
              />
            )
          }
        }
      )}
    </>
  )
}

export default MatchingForm
