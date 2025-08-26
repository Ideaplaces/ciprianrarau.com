import { getFeatureFlag } from 'components/Feature'
import { omit } from 'lodash'
import * as Yup from 'yup'

export type ProfileSchemaProps = {
  group: { slug: string }
  user: {
    mentor: boolean
    onboardingPercent: number
  }
}

export const profileSchema = (
  group?: ProfileSchemaProps['group'],
  user?: ProfileSchemaProps['user']
) => {
  const done = user?.onboardingPercent === 100

  const readOnlyFormFields: any = getFeatureFlag(group, 'readOnlyFields', user)

  const readOnlyFields: any = readOnlyFormFields['userProfile']?.fields || []
  const isUsed = (field: string) => !!getFeatureFlag(group, field)

  const yupObject = {
    name: Yup.string().required().max(1000),
    pronouns: Yup.string().nullable().max(99),
    company: Yup.string().nullable().max(100),
    description:
      done && isUsed('description')
        ? Yup.string().required().max(2000)
        : Yup.string().nullable().max(2000),
    discipline:
      done && isUsed('discipline')
        ? Yup.string().required()
        : Yup.string().nullable(),
    experience:
      done && isUsed('experience')
        ? Yup.number().required().min(0).max(99)
        : Yup.number().nullable().min(0).max(99),
    website: Yup.string().url().nullable().max(4000),
    skills:
      done && isUsed('skills')
        ? Yup.string().required().max(160)
        : Yup.string().nullable().max(160),
    role: Yup.string().nullable().max(70),
    welcomeMessage:
      user?.mentor && done && isUsed('welcomeMessage')
        ? Yup.string().required().max(400)
        : Yup.string().nullable().max(400),
    youtubeLink: Yup.string().url().nullable().max(1000),
    vimeoLink: Yup.string().url().nullable().max(1000),
    twitterLink: Yup.string().url().nullable().max(1000),
    linkedinLink: Yup.string().url().nullable().max(1000),
    instagramLink: Yup.string().url().nullable().max(1000),
    facebookLink: Yup.string().url().nullable().max(1000),
    dribbbleLink: Yup.string().url().nullable().max(1000),
    behanceLink: Yup.string().url().nullable().max(1000),
    slug: Yup.string().nullable().max(25),
    longTermGoals:
      !user?.mentor && done && isUsed('longTermGoals')
        ? Yup.string().required()
        : Yup.string().nullable(),
    shortTermGoals:
      !user?.mentor && done && isUsed('shortTermGoals')
        ? Yup.string().required()
        : Yup.string().nullable(),
  }

  const editableFields = omit(yupObject, readOnlyFields)

  return Yup.object().shape(editableFields)
}

export default profileSchema
