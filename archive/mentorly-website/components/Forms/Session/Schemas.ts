import * as Yup from 'yup'

type ValueType = {
  guests: any[]
  hosts: any[]
  maxParticipants: number
}

type SessionSchemaProps = {
  setMentor: boolean
  allowHosts?: boolean
}

const countParticipants = (values: ValueType) =>
  (values.guests.length || 0) + (values.hosts.length || 0)

const validateParticipants = (values: ValueType) =>
  countParticipants(values) <= values.maxParticipants

// @TODO: create a masterclassSchema should inherit groupSessionSchema
// as it contains all the same fields plus more

const basicSessionSchema = Yup.object().shape({
  title: Yup.string().required().max(80),
  description: Yup.string().required().max(1000),
  startTime: Yup.date().required().min(new Date(), 'form.noPastDate'),
  duration: Yup.number().required(),
})

const groupSessionSchema = ({ setMentor }: SessionSchemaProps) => {
  return basicSessionSchema.shape({
    mentor: setMentor ? Yup.mixed().required() : Yup.object().nullable(),
    guests: Yup.array().nullable(),
  })
}

const masterclassSchema = ({ setMentor, allowHosts }: SessionSchemaProps) => {
  return basicSessionSchema.shape({
    mentor: setMentor ? Yup.mixed().required() : Yup.object().nullable(),
    minParticipants: Yup.number().required().min(0, 'form.noNegative'),
    maxParticipants: Yup.number()
      .required()
      .max(100)
      .test(
        'Cannot be less than current number of participants',
        'form.minGreaterThanCurrentBatch',
        function (maxParticipants) {
          if (!maxParticipants || maxParticipants < 1) {
            return false
          }
          return maxParticipants >= countParticipants(this.parent)
        }
      )
      .min(Yup.ref('minParticipants'), 'form.minGreaterThanMax'),
    hosts: allowHosts
      ? Yup.array().test(
          'hosts and guests cannot exceed maximum participants value',
          'form.participantsHostsPlusGuests',
          function () {
            return validateParticipants(this.parent)
          }
        )
      : Yup.array().nullable(),
    guests: Yup.array().test(
      'guests and hosts cannot exceed maximum participants value',
      'form.participantsHostsPlusGuests',
      function () {
        return validateParticipants(this.parent)
      }
    ),
  })
}

export { masterclassSchema, groupSessionSchema }
