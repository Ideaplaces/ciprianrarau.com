import PropTypes from 'prop-types'
import React, {
  createContext,
  createElement,
  forwardRef,
  ReactNode,
} from 'react'

const HeadingContext = createContext(0)

export const H = forwardRef((props: any, ref: any) => (
  <HeadingContext.Consumer>
    {(level) => createElement(`h${Math.min(level, 6)}`, { ref, ...props })}
  </HeadingContext.Consumer>
))

H.displayName = 'H'

export type SectionProps = {
  children: ReactNode
}

export const Section = ({ children }: SectionProps): JSX.Element => (
  <HeadingContext.Consumer>
    {(headingContext) => (
      <HeadingContext.Provider value={headingContext + 1}>
        <section>{children}</section>
      </HeadingContext.Provider>
    )}
  </HeadingContext.Consumer>
)

Section.H = H

Section.propTypes = {
  children: PropTypes.node,
}

export default Section
