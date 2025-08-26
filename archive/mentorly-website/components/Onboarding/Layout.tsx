import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mt-8">
      <div className="md:p-8 bg-lightGray mb-5 z-0">{children}</div>
      <div className="bg-gray fixed top-0 bottom-0 left-0 right-0 pb-5 z-0"></div>
    </div>
  )
}

export default Layout
