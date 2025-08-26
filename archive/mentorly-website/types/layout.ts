import React from 'react'

import { Maybe } from './graphql'

export type PageLayoutProps = {
  Layout?: ({ children }: { children: React.ReactNode }) => Maybe<JSX.Element>
  maintenance?: boolean
}
