import { gql } from '@apollo/client'

export const disciplineFields = gql`
  fragment DisciplineFields on Discipline {
    id
    name
    nameEn: name(locale: "en")
    nameFr: name(locale: "fr")
    slug
    userCount
    subdisciplines {
      ...SubdisciplineFields
    }
  }
`

export const disciplineMutationFields = gql`
  fragment DisciplineMutationFields on Discipline {
    id
    name
    nameEn: name(locale: "en")
    nameFr: name(locale: "fr")
    slug
  }
`

export const subdisciplineFields = gql`
  fragment SubdisciplineFields on Subdiscipline {
    id
    name
    nameEn: name(locale: "en")
    nameFr: name(locale: "fr")
    slug
    userCount
  }
`

export const subdisciplineMutationFields = gql`
  fragment SubdisciplineMutationFields on Subdiscipline {
    id
    name
    nameEn: name(locale: "en")
    nameFr: name(locale: "fr")
    slug
  }
`

gql`
  mutation createSubdiscipline($values: SubdisciplineAttributes!) {
    createSubdiscipline(attributes: $values) {
      subdiscipline {
        ...SubdisciplineFields
      }
      errors
      errorDetails
    }
  }

  mutation createDiscipline($values: DisciplineAttributes!) {
    createDiscipline(attributes: $values) {
      discipline {
        ...DisciplineFields
      }
      errors
      errorDetails
    }
  }
  ${disciplineFields}
  ${subdisciplineFields}
`
