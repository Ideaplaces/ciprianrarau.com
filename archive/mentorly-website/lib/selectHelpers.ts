import { isArray, isEmpty, sortBy, uniqBy } from 'lodash'
import { Maybe } from 'types/graphql'

export type SelectOption<T = any> = {
  readonly value: T
  readonly label: string
}

type DataType = Record<string, any>

export type SelectDataType = DataType | DataType[]

export type SelectProps = {
  name: string
  options: SelectOption | SelectOption[]
  onValueChange: (option: Maybe<SelectDataType>) => void
  isMulti?: boolean
  value?: any
}

const formatToOptions = (obj: DataType) => {
  return {
    label: obj.name as string,
    value: obj.id,
  }
}
const formatFromOptions = (obj: DataType) => {
  return {
    name: obj.label,
    id: obj.value,
  }
}

export const convertToOptions = (
  data?: SelectDataType,
  isMulti = true
): SelectOption[] | undefined => {
  if (isEmpty(data)) {
    return isMulti ? [] : undefined
  }

  if (isArray(data)) {
    return data.map((obj) => formatToOptions(obj))
  }

  if (!isMulti && data) {
    return [formatToOptions(data)]
  }

  return []
}

export const convertFromOptions = (
  data?: SelectDataType,
  isMulti = true
): SelectDataType | undefined => {
  if (isEmpty(data)) {
    return isMulti ? [] : undefined
  }

  if (isArray(data)) {
    return data.map((obj) => formatFromOptions(obj))
  }

  if (!isMulti && data) {
    return formatFromOptions(data)
  }

  return []
}

type Subdiscipline = {
  id: string
  name?: Maybe<string>
}

type Discipline = {
  id: string
  subdisciplines?: Maybe<Subdiscipline[]>
}

export const subdisciplines = (
  disciplines?: Maybe<Discipline | undefined>[],
  selections?: Discipline[]
) => {
  let result: Subdiscipline[] = []

  if (!selections) {
    return result
  }

  if (!isArray(selections)) {
    selections = [selections]
  }

  selections.forEach((selection) => {
    const d = disciplines?.find((d) => d?.id === selection?.id)

    if (d?.subdisciplines) {
      result = [...result, ...d.subdisciplines]
    }
  })

  result = uniqBy(result, (r) => r.id)

  return sortBy(result, (r) => r.name)
}
