import classNames from 'classnames'
import { VFC } from 'react'
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'

import classes from './Currency.module.scss'

type CurrencyProps = {
  onValueChange: (...args: any) => void
  value: CurrencyInputProps['defaultValue']
  disabled?: boolean
}

const Currency: VFC<CurrencyProps> = ({ onValueChange, value, disabled }) => {
  return (
    <div
      className={classNames(classes.Currency, {
        'bg-gray rounded text-evenDarkerGray': disabled,
      })}
    >
      <CurrencyInput
        placeholder="Enter amount"
        decimalsLimit={2}
        intlConfig={{ locale: 'en-US', currency: 'USD' }}
        defaultValue={value}
        onValueChange={(value) => onValueChange(value)}
        value={value}
        disabled={disabled}
        decimalScale={2}
      />
    </div>
  )
}

export default Currency
