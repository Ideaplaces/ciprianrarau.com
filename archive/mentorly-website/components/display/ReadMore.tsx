import React, { useState, VFC } from 'react'
import { useIntl } from 'react-intl'

export type ReadMoreProps = {
  text?: string
  breakpoint: number
}

const ReadMore: VFC<ReadMoreProps> = ({ text, breakpoint }) => {
  const { formatMessage } = useIntl()
  const [state, setState] = useState('less')

  if (!text) {
    return null
  }

  const firstChunk = text.split(' ').slice(0, breakpoint).join(' ')
  const lastChunk = text.split(' ').slice(breakpoint).join(' ')

  if (text.split(' ').length < breakpoint) return <p>{text}</p>
  return (
    <p>
      {firstChunk}
      {state === 'less' && '...'}{' '}
      {state === 'less' && (
        <span
          className="underline cursor-pointer hover:opacity-50"
          onClick={() => setState('more')}
        >
          {formatMessage({ id: 'button.readMore' })}
        </span>
      )}
      {state === 'more' && (
        <>
          {lastChunk}{' '}
          <span
            className="underline cursor-pointer hover:opacity-50"
            onClick={() => setState('less')}
          >
            {formatMessage({ id: 'button.readLess' })}
          </span>
        </>
      )}
    </p>
  )
}

export default ReadMore
