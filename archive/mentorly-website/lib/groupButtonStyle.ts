// eslint-disable-next-line import/default
import { contrastBW } from 'lib/color'
import { Group, ManagedGroup } from 'types/graphql'

export type groupButtonStyleProps = {
  currentGroup: Pick<ManagedGroup | Group, 'styles'>
  isDashboard?: boolean
  inverted?: boolean
}
export const groupButtonStyle = ({
  currentGroup,
  isDashboard,
  inverted,
}: groupButtonStyleProps) => {
  const bg = (!isDashboard && currentGroup?.styles?.backgroundColor) || 'black'
  const bgOpposite = contrastBW(bg || '#fdde35')
  const invertText = contrastBW(bgOpposite)

  return inverted
    ? { backgroundColor: bgOpposite, color: invertText }
    : { backgroundColor: bg || '#fdde35', color: bgOpposite }
}
