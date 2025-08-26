import classNames from 'classnames'
import { useFormikContext } from 'formik'
import RcSlider, { createSliderWithTooltip, SliderProps } from 'rc-slider'
import { useState, VFC } from 'react'

const Control = createSliderWithTooltip(RcSlider)

type RcSliderProps = SliderProps & {
  name: string
}

const Slider: VFC<RcSliderProps> = ({
  className,
  name,
  value,
  min,
  max,
  step,
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  const { setFieldValue } = useFormikContext()

  const handleChange = (v: number) => {
    setCurrentValue(v)
  }

  const handleAfterChange = (v: number) => {
    setFieldValue(name, v)
  }

  return (
    <div className={classNames('h-8 flex items-center', className)}>
      <Control
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        onAfterChange={handleAfterChange}
      />
    </div>
  )
}

export default Slider
