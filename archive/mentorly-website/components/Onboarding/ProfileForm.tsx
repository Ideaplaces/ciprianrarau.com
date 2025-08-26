import { gql } from '@apollo/client'
import Button from 'components/Button'
import CountrySelect from 'components/controls/CountrySelect'
import DatePicker from 'components/controls/DatePicker'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import LanguageSelect from 'components/controls/LanguageSelect'
import RadioSelect from 'components/controls/RadioSelect'
import RecordSelect from 'components/controls/RecordSelect'
import Textarea from 'components/controls/Textarea'
import { getFeatureFlag } from 'components/Feature'
import { MenteeFields, MentorFields } from 'components/Forms/User/Profile'
import FormHeader from 'components/Onboarding/FormHeader'
import { FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import { subdisciplines } from 'lib/selectHelpers'
import { useCurrentUser } from 'lib/UserContext'
import { omit } from 'lodash'
import { OnboardingFormsProps } from 'pages/[locale]/onboarding'
import { useIntl } from 'react-intl'
import { Maybe, useUpdateUserMutation } from 'types/graphql'
import * as Yup from 'yup'

gql`
  fragment ProfileFormFields on CurrentUser {
    company
    contactEmail
    countryCode
    dateOfBirth
    description
    discipline {
      id
      name
      subdisciplines {
        id
        name
      }
    }
    disciplines {
      id
      name
      subdisciplines {
        id
        name
      }
    }
    id
    linkedinLink
    languages {
      code
      id
      name
    }
    location
    longTermGoals
    mentor
    name
    phoneNumber
    extensionNumber
    preferredLanguage {
      id
      code
      name
    }
    pronouns
    contactEmail
    role
    shortTermGoals
    skills
    subdisciplines {
      id
      name
    }
    website
    welcomeMessage
    welcomeMessage
  }
`

export type SubdisciplineType = { id: string }
export type DisciplineType = {
  id: string
  subdisciplines?: Maybe<SubdisciplineType[]>
}

// @TODO: make reusable function to share between
// Profile form and this onboarding/ProfileForm
const personalFormSchema = (featureFlag: any) => {
  return Yup.object().shape({
    company: Yup.string().nullable().max(120),
    countryCode: Yup.string().nullable(),
    contactEmail: Yup.string().nullable().required(),
    dateOfBirth: featureFlag('requireDateOfBirth')
      ? Yup.string().nullable().required()
      : Yup.string().nullable(),
    description: Yup.string().nullable().max(2000),
    discipline: Yup.string().nullable(),
    linkedinLink: Yup.string().nullable().url(),
    location: Yup.string().nullable(),
    longTermGoals: Yup.string().nullable(),
    name: Yup.string().required(),
    phoneNumber: featureFlag('requirePhoneNumber')
      ? Yup.string().nullable().required()
      : Yup.string().nullable(),
    extensionNumber: Yup.string().nullable(),
    pronouns: Yup.string().nullable().max(99),
    role: Yup.string().nullable(),
    shortTermGoals: Yup.string().nullable(),
    skills: Yup.string().nullable().max(160),
    subdisciplines: Yup.string().nullable().max(2000),
    website: Yup.string().nullable().url(),
    welcomeMessage: Yup.string().nullable().max(400),
  })
}

const personalFormSchemaRequired = (featureFlag: any) => {
  return Yup.object().shape({
    company: Yup.string().nullable().required().max(120),
    countryCode: Yup.string().nullable(),
    contactEmail: Yup.string().nullable(),
    dateOfBirth: featureFlag('requireDateOfBirth')
      ? Yup.string().nullable().required()
      : Yup.string().nullable(),
    description: Yup.string().nullable().max(2000),
    discipline: Yup.string().nullable(),
    linkedinLink: Yup.string().nullable().url(),
    location: Yup.string().nullable().required(),
    longTermGoals: Yup.string().nullable(),
    name: Yup.string().required(),
    phoneNumber: featureFlag('requirePhoneNumber')
      ? Yup.string().nullable().required()
      : Yup.string().nullable(),
    extensionNumber: Yup.string().nullable(),
    pronouns: Yup.string().nullable().max(99),
    role: Yup.string().nullable(),
    shortTermGoals: Yup.string().nullable(),
    skills: Yup.string().nullable().max(160),
    subdisciplines: Yup.string().nullable().max(2000),
    website: Yup.string().nullable().url(),
    welcomeMessage: Yup.string().nullable().max(400),
  })
}

type ProfileFormProps = Omit<OnboardingFormsProps, 'goPrev'>

const ProfileForm = ({
  goNext,
  step,
  formKey,
  user,
  disciplines,
  required,
  mentor,
  setMentor,
}: ProfileFormProps) => {
  const { formatMessage } = useIntl()
  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['currentFullUser', 'onboardingPage'],
  })

  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()

  const featureFlag = (key: string) => {
    return getFeatureFlag(currentGroup, key)
  }

  const schema = required
    ? personalFormSchemaRequired(featureFlag)
    : personalFormSchema(featureFlag)

  const accountType = [
    { value: false, name: formatMessage({ id: 'term.mentee' }) },
    { value: true, name: formatMessage({ id: 'term.mentor' }) },
  ]

  if (!user) {
    return null
  }

  if (!disciplines && user?.discipline) {
    disciplines = [user.discipline]
  }

  const handleSubmit = (values: FormikValues) => {
    const newValues = omit(values)
    const attributes = formatMutationVariables(newValues, {
      preferredLanguage: 'code',
      languages: 'code',
      disciplines: 'id',
      subdisciplines: 'id',
    })

    updateUser({
      variables: { id: user?.id || currentUser.id, attributes },
    }).then(() => goNext && goNext())
  }

  const initialValues = {
    company: user?.company,
    contactEmail: user?.contactEmail,
    countryCode: user?.countryCode,
    dateOfBirth: user?.dateOfBirth,
    description: user?.description,
    disciplines: user?.disciplines,
    languages: user?.languages,
    linkedinLink: user?.linkedinLink,
    location: user?.location,
    longTermGoals: user?.longTermGoals,
    mentor: user?.mentor,
    name: user?.name,
    phoneNumber: user?.phoneNumber,
    extensionNumber: user?.extensionNumber,
    pronouns: user?.pronouns,
    preferredLanguage: user?.preferredLanguage,
    role: user?.role,
    shortTermGoals: user?.shortTermGoals,
    skills: user?.skills,
    subdisciplines: user?.subdisciplines,
    welcomeMessage: user?.welcomeMessage,
  }
  return (
    <div>
      <FormHeader step={step} formKey={formKey} />

      <Form
        id="profileForm"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
        showErrorSummary
      >
        {({ isSubmitting, values }: FormikValues) => (
          <>
            {getFeatureFlag(currentGroup, 'roleSelection') && (
              <Field
                name="mentor"
                control={RadioSelect}
                options={accountType}
                customChangeHandler={(value) => setMentor && setMentor(value)}
              />
            )}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <Field
                  name="name"
                  placeholder={formatMessage({ id: 'form.name' })}
                />
              </div>
              <div className="md:w-1/2">
                <Field
                  name="pronouns"
                  placeholder={formatMessage({
                    id: 'form.placeholder.pronouns',
                  })}
                />
              </div>
            </div>
            {getFeatureFlag(currentGroup, 'requireDateOfBirth') && (
              <Field
                name="dateOfBirth"
                type="date"
                control={DatePicker}
                minDate={new Date(1850, 0, 1)}
                placeholder={formatMessage({ id: 'util.selectDate' })}
                adultBirthDate
                full
              />
            )}
            <Field
              name="contactEmail"
              type="email"
              placeholder="email@example.com"
            />
            {getFeatureFlag(currentGroup, 'requirePhoneNumber') && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/2">
                  <Field name="phoneNumber" placeholder="+1 888 888 8888" />
                </div>
                <div className="md:w-1/2">
                  <Field name="extensionNumber" />
                </div>
              </div>
            )}
            <Field
              name="languages"
              type="select"
              control={LanguageSelect}
              isMulti
            />
            <Field
              name="preferredLanguage"
              type="select"
              control={LanguageSelect}
              mainOnly
            />
            {getFeatureFlag(currentGroup, 'userLocation') && (
              <Field
                name="location"
                defaultValue={initialValues?.location}
                border="true"
              />
            )}
            {getFeatureFlag(currentGroup, 'userCountry') && (
              <Field name="countryCode" type="select" control={CountrySelect} />
            )}
            {getFeatureFlag(currentGroup, 'userCompany') && (
              <Field
                name="company"
                defaultValue={initialValues?.company}
                border="true"
              />
            )}
            {getFeatureFlag(currentGroup, 'userDescription') && (
              <Field
                name="description"
                // label={
                //   !mentor ? formatMessage({ id: 'term.whyIJoined' }) : undefined
                // }
                controlStyle={{ minHeight: '66px' }}
                placeholder={formatMessage({
                  id: 'form.placeholder.describeYourself',
                })}
                control={Textarea}
                rows={2}
              />
            )}
            {getFeatureFlag(currentGroup, 'userDisciplines') && (
              <Field
                name="disciplines"
                type="select"
                control={RecordSelect}
                options={disciplines}
                isMulti
                instructions={formatMessage({ id: 'term.chooseMany' })}
              />
            )}
            {getFeatureFlag(currentGroup, 'userSubdisciplines') && (
              <Field
                name="subdisciplines"
                type="select"
                control={RecordSelect}
                options={subdisciplines(disciplines, values.disciplines)}
                isMulti
                instructions={formatMessage({ id: 'term.chooseMany' })}
              />
            )}
            {getFeatureFlag(currentGroup, 'userSkills') && (
              <Field
                name="skills"
                label={
                  !mentor
                    ? formatMessage({ id: 'term.soughtAfterSkills' })
                    : undefined
                }
                placeholder={formatMessage({
                  id: `form.placeholder.describe${
                    mentor ? 'Your' : 'Desired'
                  }Skills`,
                })}
              />
            )}
            {mentor && getFeatureFlag(currentGroup, 'userWelcomeMessage') && (
              <MentorFields />
            )}
            {!mentor && getFeatureFlag(currentGroup, 'userGoals') && (
              <MenteeFields />
            )}

            {getFeatureFlag(currentGroup, 'userRole') && (
              <Field name="role" border="true" />
            )}

            {getFeatureFlag(currentGroup, 'userLinkedinLink') && (
              <Field name="linkedinLink" border="true" />
            )}

            <div className="flex justify-end my-3">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {formatMessage({ id: 'button.next' })}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

export default ProfileForm
