import React, { ReactNode, VFC } from 'react'

import styles from './List.module.scss'

type ListProps = {
  elements: ReactNode[]
  checkmark?: boolean
  active: number
}

const List: VFC<ListProps> = ({ elements, checkmark = false, active }) => (
  <ul className={checkmark ? styles.checkmark : undefined}>
    {elements.map((el, i) => {
      return (
        <li key={i} className={i > active - 1 ? styles.disabled : undefined}>
          <span>{el}</span>
        </li>
      )
    })}
  </ul>
)

export default List
