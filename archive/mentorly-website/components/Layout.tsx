import GroupLayout from 'components/pages/Groups/Layout'
import HomeLayout from 'components/pages/Home/Layout'
import { FC, ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
  groupId?: string
}
export const Layout: FC<LayoutProps> = ({ children, groupId }) => {
  if (groupId) {
    return <GroupLayout>{children}</GroupLayout>
  }

  return <HomeLayout>{children}</HomeLayout>
}

export default Layout
