import { VFC } from 'react'

export type SmallLogoProps = {
  className?: string
  color?: string
  whiteLabel?: boolean
}

export const SmallLogo: VFC<SmallLogoProps> = ({
  className,
  color,
  whiteLabel,
}) => {
  const basicM =
    'M29.6188 38L29.5732 10.3143L18.0268 33.3857H15.9275L4.38121 10.4771V38H0V0H3.74228L17.0685 26.7086L30.2121 0H33.9544L34 38H29.6188Z'
  const mentorlyM =
    'M23 16.5l8.8-8.9V38h3.1V.2l-14 14.1 2.1 2.2zm-3.2 3.2l-2.2-2.2-1.6-1.6L0 0v38h3.1V7.4L21 25.1c.9.9 1.4 2.1 1.4 3.3 0 1.3-.5 2.5-1.4 3.3-.9.9-2.1 1.4-3.4 1.4-1.2 0-2.4-.5-3.3-1.4-.9-.7-1.3-1.9-1.3-3.2 0-1.2.5-2.4 1.4-3.3l.1-.1-2.2-2.2-.1.1c-1.5 1.5-2.3 3.4-2.3 5.5s.8 4 2.3 5.5 3.4 2.3 5.4 2.3c2.1 0 4-.8 5.5-2.3s2.3-3.4 2.3-5.5-.8-4-2.3-5.5l-3.3-3.3z'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34.9 38"
      className={className}
    >
      <path fill={color} d={whiteLabel ? basicM : mentorlyM} />
    </svg>
  )
}

export default SmallLogo
