import { gql } from '@apollo/client'
import classNames from 'classnames'
import { RequestDemo } from 'components/Forms/RequestDemo/'
import { List } from 'components/List'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import Price from './Price'

gql`
  fragment PlanFields on PlanContent {
    id
    name(locale: $locale)
    description(locale: $locale)
    users(locale: $locale)
    mainFeatures(locale: $locale)
    price(locale: $locale)
  }
`

type PlanProps = {
  color: string
  data: any
}

const Plan: VFC<PlanProps> = ({ color, data }) => {
  const { formatMessage } = useIntl()
  const className = classNames(
    color,
    'rounded-t text-white px-8 lg:px-8 py-8 grow'
  )

  return (
    <div className="text-center relative z-10 text-lg bg-white h-full flex flex-col">
      <div className={className}>
        <div className="m-auto" style={{ maxWidth: 261 }}>
          <h5 className="font-black text-xl mb-2">Mentorly {data.name}</h5>
          <p>{data.description}</p>
        </div>
      </div>
      <div className="bg-gray font-black px-18 py-6">
        <ul>
          <li>{data.users}</li>
          <li>{formatMessage({ id: 'pricing.unlimitedSessions' })}</li>
        </ul>
      </div>
      <div className="flex flex-col bg-white border border-gray rounded-b gap-4">
        <div className="text-left px-16 py-8 h-60">
          <List
            checkmark
            elements={data.mainFeatures.split('\n').filter((i: any) => i)}
            active={data.features}
          />
        </div>
        <Price value={data.price} />
        <div className="p-6 flex justify-center">
          <RequestDemo
            formId="contact-sales"
            messageId="pricing.contactSales"
          />
        </div>
      </div>
    </div>
  )
}

export default Plan
