import classNames from 'classnames'
import { motion } from 'lib/framer-motion'

export type Props = {
  name?: string
  testId?: string
  value: boolean
  onValueChange?: (value: boolean) => void
  onClick?: () => void
}

const ToggleSwitch: React.FC<Props> = ({
  name,
  testId,
  onValueChange,
  onClick,
  value,
}) => {
  const variants = {
    on: { x: 18 },
    off: { x: 0 },
  }

  const handleChange = () => {
    onValueChange && onValueChange(!value)
    onClick && onClick()
  }

  return (
    <motion.label
      htmlFor="toggle"
      onClick={onClick}
      className={classNames(
        'w-10 rounded-full relative flex cursor-pointer hover:opacity-75',
        value ? 'bg-green' : 'bg-darkGray'
      )}
      style={{ padding: 2 }}
    >
      <motion.div
        animate={value ? 'on' : 'off'}
        className="w-5 h-5 bg-white align-middle rounded-full border border-darkGray"
        variants={variants}
        style={{ width: 18, height: 18 }}
        initial={value ? 'on' : 'off'}
      />
      <input
        type="checkbox"
        onChange={handleChange}
        className="hidden"
        checked={value}
        name={name}
        data-testid={testId || name}
      />
    </motion.label>
  )
}

export default ToggleSwitch
