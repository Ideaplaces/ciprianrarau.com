import 'yup-phone-lite'

import { ROUTING_NUMBER_TYPES } from 'components/controls/StripeCountrySelect'
import * as Yup from 'yup'

const schemaObject: Record<string, any> = {
  dateOfBirth: Yup.string().required(),
  postalCode: Yup.string().required(),
  address: Yup.string().required(),
  city: Yup.string().required(),
  country: Yup.object().required(),
  phone: Yup.string().required(),
  url: Yup.string().url().required(),
  state: Yup.string()
    .nullable()
    .when('country', {
      is: (country) => {
        return !country?.value?.validWithoutProvince
      },
      then: Yup.string().required(),
    }),
  personalIdNumber: Yup.string().when('country', {
    is: (country) => {
      return !!country?.value?.personal_id_number
    },
    then: Yup.string().required(),
  }),
  accountNumber: Yup.string().required(),
}

ROUTING_NUMBER_TYPES.map((routerType) => {
  schemaObject[routerType] = Yup.string().when('country', {
    is: (country) => {
      return country?.value?.routing_number?.some(
        (router: Record<string, any>) => router.id === routerType
      )
    },
    then: Yup.string().required(),
  })
})

const bankAccountSchema = Yup.object().shape(schemaObject)

export { bankAccountSchema }
