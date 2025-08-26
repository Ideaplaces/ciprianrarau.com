import classNames from 'classnames'
import useAutosizeTextArea from 'lib/hooks/useAutosizeTextArea'
import useDependentState from 'lib/hooks/useDependentState'
import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  VFC,
} from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  border?: boolean
  onValueChange?: (value: string) => void
  testId?: string
  error?: boolean
}

function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null)

  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') {
      ref(innerRef.current)
    } else {
      ref.current = innerRef.current
    }
  })

  return innerRef
}

export const Textarea: VFC<TextareaProps> = forwardRef(
  (
    {
      border,
      className,
      style,
      name,
      onBlur,
      onChange,
      onValueChange,
      value,
      testId,
      error,
      ...props
    },
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const [currentValue, setCurrentValue] = useDependentState<string>(
      value ? String(value) : ''
    )

    const innerRef = useForwardedRef(ref)

    useAutosizeTextArea(innerRef.current, currentValue)

    const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
      if (onValueChange) {
        onValueChange(currentValue)
      }

      if (onBlur) {
        onBlur(event)
      }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentValue(event.target.value)

      if (onChange && !onValueChange) {
        onChange(event)
      }
    }

    return (
      <textarea
        ref={innerRef}
        name={name}
        value={currentValue}
        data-testid={testId || name}
        className={classNames(
          className,
          'block py-2 px-3 rounded w-full text-black placeholder-darkGray focus:outline-none focus:ring',
          {
            'border border-darkGray': border,
            'border border-red': error,
          }
        )}
        onBlur={handleBlur}
        onChange={handleChange}
        rows={1}
        style={style}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
