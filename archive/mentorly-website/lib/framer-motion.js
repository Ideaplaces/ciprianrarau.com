/* eslint-disable */
import {
  createDomMotionComponent,
  motion as originalMotion,
} from 'framer-motion'

export const motion = {
  a: createDomMotionComponent('a'),
  // article: createDomMotionComponent('article'),
  button: createDomMotionComponent('button'),
  div: createDomMotionComponent('div'),
  // header: createDomMotionComponent('header'),
  img: createDomMotionComponent('img'),
  label: createDomMotionComponent('label'),
  li: createDomMotionComponent('li'),
  nav: createDomMotionComponent('nav'),
  path: createDomMotionComponent('path'),
  span: createDomMotionComponent('span'),
  // svg: createDomMotionComponent('svg'),
  ul: createDomMotionComponent('ul'),
  custom: originalMotion,
}

// re-export everything
export * from 'framer-motion'
