import { motion, SVGMotionProps } from 'lib/framer-motion'
import { VFC } from 'react'
import { Maybe } from 'types/graphql'

const Path = (props: SVGMotionProps<SVGPathElement>) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke={props.color || 'hsl(0, 0%, 18%)'}
    strokeLinecap="round"
    {...props}
  />
)

type MenuToggleProps = {
  toggle: (...args: any) => void
  color?: Maybe<string>
}

export const MenuToggle: VFC<MenuToggleProps> = ({ toggle, color }) => (
  <button
    onClick={toggle}
    className="z-top wrapper flex justify-center items-center focus:outline-none -mr-6"
  >
    <svg width="22" height="22" viewBox="0 0 22 19">
      <Path
        color={color || undefined}
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        color={color || undefined}
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        color={color || undefined}
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
)
