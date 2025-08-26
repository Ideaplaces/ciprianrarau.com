import * as Yup from 'yup'
// @TODO: phone RegEx should be based on "location" country chosen
// but we could allow for "123 456 7890 before 5pm, 098 765 4321 after"
// and even "902 506 3421 or try my cell at 098 765 4321"

export const GeneralSchema = Yup.object().shape({
  email: Yup.string().email().required().max(80),
  contactEmail: Yup.string().email().max(80),
  phoneNumber: Yup.string().nullable().min(7).max(50),
  languages: Yup.string().nullable().max(200),
  preferredLanguage: Yup.string().nullable().max(80),
})

export const DashboardSettingsSchema = Yup.object().shape({
  name: Yup.string().required().max(80),
  email: Yup.string().email().required().max(80),
  contactEmail: Yup.string().email().max(80),
  phoneNumber: Yup.string().nullable().min(7).max(50),
  languages: Yup.string().nullable().max(200),
  preferredLanguage: Yup.string().nullable().max(80),
})

export const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required().max(80),
  newPassword: Yup.string().required().max(80),
})

export const ConnectionsSchema = Yup.object().shape({
  calendarProvider: Yup.string().nullable(),
  calendarUrl: Yup.string().nullable().when('calendarProvider', {
    is: 'calendarUrl',
    then: Yup.string().url().required(),
  }),
  calendarId: Yup.string()
    .nullable()
    .when('calendarProvider', {
      is: (p) => !['calendarUrl', 'internal', undefined].includes(p),
      then: Yup.string().required(),
    }),
  availabilityCalendarId: Yup.string().nullable(),
})
