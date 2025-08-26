import { VFC } from 'react'
import { useIntl } from 'react-intl'

type PriceProps = {
  value: string | number
}
const Price: VFC<PriceProps> = ({ value }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="flex justify-center items-baseline">
      {isNaN(value as number) ? (
        <>
          <b className="text-4xl font-black">&nbsp;</b>
          <div className="text-xl font-black">{value}</div>
        </>
      ) : (
        <>
          <div>USD</div>
          <div className="font-black self-start">$</div>
          <b className="text-4xl font-black">{value}</b>
          {formatMessage({ id: 'pricing.priceMonth' })}
        </>
      )}
    </div>
  )
}

export default Price
