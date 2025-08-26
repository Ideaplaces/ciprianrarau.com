import { useEffect, useState } from 'react'

const useDependentState = <T>(value: T) => {
  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value)
    }
  }, [value])

  return [currentValue, setCurrentValue] as const
}

export default useDependentState
