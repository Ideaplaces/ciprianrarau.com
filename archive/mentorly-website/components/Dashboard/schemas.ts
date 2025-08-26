import { ratio } from 'get-contrast'
import { Maybe } from 'types/graphql'
import * as Yup from 'yup'

const basicSchema = Yup.object().shape({
  title: Yup.string().required().max(60),
  subtitle: Yup.string().required().max(190),
  aboutText: Yup.string().required().max(2000),
})

const detailsSchema = basicSchema.shape({
  name: Yup.string().required().max(60),
  slug: Yup.string().required().max(60),
  startsAt: Yup.date().nullable(),
  endsAt: Yup.date()
    .nullable()
    .min(Yup.ref('startsAt'), 'form.startGreaterThanEnd'),
  enableCohorts: Yup.boolean().nullable(),
  menteesOnboardOn: Yup.date().nullable().min(new Date(), 'form.noPastDate'),
  menteeOnboarding: Yup.string().oneOf(['manual', 'automatic']),
  menteeMaxSessions: Yup.number().nullable().min(0, 'form.noNegative'),
  mentorOnboarding: Yup.string().oneOf(['manual', 'automatic']),
  mentorsOnboardOn: Yup.date().nullable().min(new Date(), 'form.noPastDate'),
  mentorMaxSessions: Yup.number().nullable().min(0, 'form.noNegative'),
  allowGroupSessions: Yup.boolean().nullable(),
  allowMasterclasses: Yup.boolean().nullable(),
  autoAcceptBookingRequests: Yup.boolean().nullable(),
  sessionLengths: Yup.number().nullable(),
  autoMatching: Yup.boolean().nullable(),
  manualMatching: Yup.boolean().nullable(),
})

const hasEnoughContrast = (color1?: Maybe<string>, color2?: string) =>
  color1 && color2 && ratio(color1, color2) > 3

const designSchema = basicSchema.shape({
  accentColor: Yup.string()
    .test('checkContrast', 'tooltip.moreContrast', function (value) {
      return hasEnoughContrast(value, this.parent.accentTextColor) || false
    })
    .required(),
  accentTextColor: Yup.string()
    .test('checkContrast', 'tooltip.moreContrast', function (value) {
      return hasEnoughContrast(value, this.parent.accentColor) || false
    })
    .required(),
  backgroundColor: Yup.string()
    .test('checkContrast', 'tooltip.moreBgContrast', function (value) {
      return hasEnoughContrast(value, this.parent.backgroundTextColor) || false
    })
    .required(),
  backgroundTextColor: Yup.string()
    .test('checkContrast', 'tooltip.moreBgContrast', function (value) {
      return hasEnoughContrast(value, this.parent.backgroundColor) || false
    })
    .required(),
  highlightColor: Yup.string().required(),
  fontName: Yup.string().required(),
  titleFontName: Yup.string().required(),
})

export { detailsSchema, designSchema }
