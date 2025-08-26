import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Textarea from 'components/controls/Textarea'
import { H3 } from 'components/Headings'
import CheckBox from 'components/Input/CheckBox'
import Rating from 'components/Rating'
import { FormikHelpers, FormikState, FormikValues } from 'formik'
import { event } from 'nextjs-google-analytics'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  Maybe,
  ReviewFormFieldsFragment,
  useCreateReviewMutation,
} from 'types/graphql'
import * as Yup from 'yup'

gql`
  mutation createReview($attributes: ReviewAttributes!) {
    createReview(attributes: $attributes) {
      review {
        booking {
          id
        }
        sessionRating
        sessionRatingDetails
        otherDetails
      }
    }
  }

  fragment ReviewFormFields on Review {
    id
    sessionRating
    sessionRatingDetails
    otherDetails
    noShow
  }
`

type ReviewFormProps = {
  currentReview?: Maybe<ReviewFormFieldsFragment>
  setFinishSurvey: (finishedSurvey: boolean) => void
  bookingPid: string
  isMentor?: boolean
}

const ReviewForm: VFC<ReviewFormProps> = ({
  currentReview,
  setFinishSurvey,
  bookingPid,
  isMentor,
}) => {
  const { formatMessage } = useIntl()
  const [createReview] = useCreateReviewMutation({
    update: (cache) => {
      // Force refresh of all viewer data after review submission
      cache.evict({ fieldName: 'viewer' })
      cache.gc()
    },
  })

  let initialValues = {
    sessionRating: 0,
    sessionRatingDetails: '',
    otherDetails: '',
    noShow: false,
  }

  const ReviewFormSchema = Yup.object().shape({
    sessionRating: Yup.number().test('session', 'Required', (val) =>
      val ? val > 0 : false
    ),
    sessionRatingDetails: Yup.string().when('sessionRating', {
      is: (sessionRating) => sessionRating <= 3 && sessionRating > 0,
      then: Yup.string().min(5).matches(/[A-z]/, 'form.charError').required(),
      otherwise: Yup.string(),
    }),
    otherDetails: Yup.string(),
  })

  if (currentReview) {
    initialValues = {
      sessionRating: currentReview.sessionRating,
      sessionRatingDetails: currentReview.sessionRatingDetails || '',
      otherDetails: currentReview.otherDetails || '',
      noShow: currentReview.noShow,
    }
  }

  const handleSubmit = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    formikHelpers.setSubmitting(true)
    createReview({
      variables: {
        attributes: {
          sessionRating: values.sessionRating,
          sessionRatingDetails:
            values.sessionRating > 3 ? '' : values.sessionRatingDetails,
          platformRating: 5,
          otherDetails: values.otherDetails,
          bookingId: bookingPid,
          role: isMentor ? 'Mentor' : 'Mentee',
          noShow: values.noShow,
        },
      },
    })
      .then(() => {
        event('Post-Session Review', {
          category: 'Reviews',
          label: `review submitted`,
          // userId: currentUser?.id,
        })
        setFinishSurvey(true)
      })
      .catch((e) => {
        formikHelpers.setSubmitting(false)
        toast.error(formatMessage({ id: 'review.form.error' }))
        console.error(e)
      })
  }

  return (
    <>
      <H3>{formatMessage({ id: 'review.form.title' })}</H3>

      <div className="text-md mb-6 whitespace-pre-line">
        {formatMessage({ id: 'review.form.subtitle' })}
      </div>
      <div>
        <Form
          id="review"
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ReviewFormSchema}
          validateOnChange={false}
        >
          {({ values, isSubmitting, errors }: FormikState<FormikValues>) => (
            <>
              <h4 className="text-lg font-black mb-2">
                {formatMessage({ id: 'review.form.questionOne' })}
              </h4>
              <Field
                name="noShow"
                type="checkbox"
                control={CheckBox}
                className="w-1/2 hidden"
                label="no show"
                value={values.noShow ? values.noShow : initialValues.noShow}
              />
              <Field
                name="sessionRating"
                hideLabel
                className="flex flex-col"
                control={Rating}
                value={
                  values.sessionRating
                    ? values.sessionRating
                    : initialValues.sessionRating
                }
                validation={{
                  field: 'sessionRatingDetails',
                }}
                error={errors.sessionRating}
              />
              {values.sessionRating > 3 ||
                (values.sessionRating !== 0 && (
                  <>
                    <h4 className="text-sm font-black my-4">
                      {formatMessage({ id: 'review.form.furtherInfo' })}
                    </h4>
                    <Field
                      name="sessionRatingDetails"
                      hideLabel
                      className="flex flex-col"
                      control={Textarea}
                      error={errors.sessionRatingDetails}
                    />
                  </>
                ))}
              <h4 className="text-lg font-black my-4">
                {formatMessage({ id: 'review.form.addInfo' })}
              </h4>
              <Field
                name="otherDetails"
                hideLabel
                className="flex flex-col"
                control={Textarea}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-32 mr-3 text-sm mb-6 rounded-full ${
                  isSubmitting && 'opacity-25'
                }`}
              >
                {formatMessage({ id: 'button.submit' })}
              </Button>
            </>
          )}
        </Form>
      </div>
    </>
  )
}

export default ReviewForm
