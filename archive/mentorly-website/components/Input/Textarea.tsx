import classNames from 'classnames'
import { HTMLProps, VFC } from 'react'

type TextareaProps = HTMLProps<HTMLTextAreaElement> & {
  border?: boolean
  testId?: string
}

export const Textarea: VFC<TextareaProps> = ({
  className,
  value,
  border,
  name,
  testId,
  ...props
}) => {
  return (
    <textarea
      value={value || ''}
      name={name}
      data-testid={testId || name}
      className={classNames(
        className,
        'block py-2 px-3 rounded w-full text-black placeholder-darkGray focus:outline-none focus:ring',
        {
          'border border-darkGray': border,
        }
      )}
      rows={5}
      {...props}
    />
  )
}

export default Textarea
