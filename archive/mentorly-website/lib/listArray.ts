import { initial, last, take } from 'lodash'

import getMessages from './getMessages'

type listArrayProps = {
  arr: Array<any>
  locale: string
  limit: number
  term?: string
}

type listArrayType = (args: listArrayProps) => string

const listArray: listArrayType = ({
  arr,
  locale,
  limit,
  term = 'term.others',
}: listArrayProps) => {
  const terms = getMessages(locale)
  const noun = terms[term as keyof typeof terms]

  const formattedNoun = typeof noun === 'string' ? noun.toLowerCase() : noun

  if (!arr || arr.length < 1) return `0 ${formattedNoun}`

  if (arr.length === 1) return arr[0]

  if (limit < 1) return `${arr.length} ${formattedNoun}`

  if (limit && arr.length > limit) {
    const firsts = take(arr, limit).join(', ')
    const num = arr.length - limit
    return `${firsts} ${terms['term.and']} ${num} ${formattedNoun}`
  }

  return `${initial(arr).join(', ')} ${terms['term.and']} ${last(arr)}`
}

export default listArray
