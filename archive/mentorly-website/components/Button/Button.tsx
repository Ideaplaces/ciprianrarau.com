import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import Spinner from 'components/feedback/Spinner'
import { contrastBW } from 'lib/color'
import { motion, TargetAndTransition, VariantLabels } from 'lib/framer-motion'
import Link from 'next/link'
import { FC, ForwardedRef, forwardRef, ReactNode, Ref } from 'react'
import { Slash } from 'react-feather'
import { useIntl } from 'react-intl'

type CustomDisabledButtonProps = {
  disabled: boolean
  messageId: string
  messageProps: Record<string, any>
  linkPath: string
  linkText: string
}

type GeneralButtonProps = {
  tooltip?: string
  color?: string
  variant?: string
  weight?: string
  full?: boolean
  wide?: boolean
  slim?: boolean
  children?: ReactNode
  className?: string
  loading?: boolean
  noTapMotion?: VariantLabels | TargetAndTransition
  target?: string
  square?: boolean
  disabled?: boolean
  disabledProps?: CustomDisabledButtonProps
  onRemoveClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  ref?: Ref<any> | ForwardedRef<any>
  testId?: string
  [key: string]: any
}

const DisabledProps = (props: CustomDisabledButtonProps) => {
  const { disabled, messageId, messageProps, linkPath, linkText } = props
  const { locale, formatMessage } = useIntl()

  if (!messageId && !linkPath) return null

  const learnMore = formatMessage({ id: 'button.learnMore' })
  const message = messageId && formatMessage({ id: messageId }, messageProps)
  const msgPunctuation = message?.charAt(message.length - 1)
  const spacing = ['.', '?', '!', ' ?', ' !'].includes(msgPunctuation)
    ? ''
    : '. '

  return (
    <div className="flex p-1 opacity-60 cursor-default">
      {disabled ? (
        <Slash size={12} fill="red" color="white" className="flex-0 m-1" />
      ) : (
        <span className="text-sm">&nbsp;</span>
      )}
      <div className="flex-1 items-center inline space-x-2 text-sm">
        {message && message + spacing}
        {linkPath && (
          <span className="underline">
            <Link href={`/${locale}/${linkPath}`}>
              {formatMessage({ id: linkText, defaultMessage: learnMore })}
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}

// main difference: Button is a <button> with a spinner vs. ButtonLink is an <a> without spinner
// @TODO: ButtonLink also requires a Link wrapper, which should just be included here
// @TODO: lots of repetition here...could we export a single component as use an "as" prop
//        or something like that to determine the sort of element that will render? (i.e. a, div, button...)

const buttonClasses = ({
  color = 'black',
  weight = 'font-bold',
  className,
  full,
  wide,
  variant = 'primary',
  disabled,
  square,
  slim,
}: GeneralButtonProps) => {
  const textColor = contrastBW(color)

  return classNames(
    `inline-flex justify-center border-2 relative select-none whitespace-nowrap`,
    {
      'border-0 p-0 px-2': variant === 'icon',
      [`bg-${textColor} text-${color} ${weight} border-transparent`]:
        variant === 'invertedPrimary',
      [`bg-${color} text-${textColor} ${weight} border-transparent`]:
        variant === 'primary',
      [`border-solid border-${color} ${weight} text-${color}`]:
        variant === 'secondary',
      [`border-solid ${weight}`]: variant === 'session',
      [`border-solid border-backgroundColor ${weight} text-backgroundTextColor text-primaryContrasts bg-backgroundColor`]:
        variant === 'selected',
      'w-full': full,
      'opacity-20 pointer-events-none': disabled, // pointer-events-none needed to prevent react-laag bug in Tooltip
      'cursor-pointer': !disabled,
      'rounded-md': square,
      'rounded-full': !square,
      'px-12': wide,
      'px-8': !wide && variant !== 'icon',
      'px-6 py-1': slim,
      'py-2': !slim,
    },
    className
  )
}

export const ButtonDiv: FC<any> = forwardRef(
  (
    { variant, full, wide, slim, square, children, className, ...aProps },
    ref: Ref<HTMLDivElement>
  ) => (
    <motion.div
      className={buttonClasses({
        variant,
        full,
        wide,
        slim,
        square,
        className,
      })}
      ref={ref}
      whileTap={{ y: 2 }}
      {...aProps}
    >
      {children}
    </motion.div>
  )
)

ButtonDiv.displayName = 'ButtonDiv'

export const ButtonLink: FC<GeneralButtonProps> = forwardRef(
  (
    {
      target,
      variant,
      full,
      wide,
      slim,
      children,
      square,
      className,
      disabled,
      testId,
      ...aProps
    },
    ref
  ) => (
    <motion.a
      className={buttonClasses({
        variant,
        full,
        wide,
        slim,
        square,
        className,
        disabled,
      })}
      ref={ref}
      target={target || '_self'}
      whileTap={{ y: 2 }}
      data-testid={testId || variant}
      {...aProps}
    >
      {children}
    </motion.a>
  )
)

ButtonLink.displayName = 'ButtonLink'

const Button: FC<any> = forwardRef(
  (
    {
      color = 'black',
      variant = 'primary',
      weight,
      full,
      wide,
      slim,
      children,
      className,
      loading,
      noTapMotion,
      target,
      square,
      disabled,
      disabledProps,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRemoveClick,
      type,
      testId,
      tooltip,
      ...buttonProps
    },
    ref
  ) => (
    <span
      className={classNames(
        'flex items-center',
        full ? 'flex-col' : 'flex-wrap',
        disabled && 'cursor-not-allowed'
      )}
    >
      <Tooltip text={tooltip} hide={!tooltip}>
        <motion.button
          ref={ref}
          whileTap={!noTapMotion && !disabled ? { y: 2 } : undefined}
          target={target || '_self'}
          disabled={disabled || loading}
          data-testid={testId || variant}
          className={buttonClasses({
            color,
            variant,
            full,
            wide,
            slim,
            weight,
            disabled,
            square,
            className,
          })}
          type={type || 'button'}
          {...buttonProps}
        >
          {loading && (
            <div
              className={`absolute inset-0 flex justify-center rounded-full items-center bg-${color}`}
            >
              <Spinner color={contrastBW(color)} className="w-6 h-6 m-auto" />
            </div>
          )}
          {children}
        </motion.button>
      </Tooltip>
      {disabledProps && <DisabledProps {...disabledProps} />}
    </span>
  )
)

Button.displayName = 'Button'

export default Button
