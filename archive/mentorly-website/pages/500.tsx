import { ReactNode } from 'react'

const Custom404 = () => {
  return (
    <h1 className="text-center my-64 text-5xl font-black">An error occured</h1>
  )
}

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return <div>{children}</div>
}

Custom404.Layout = Layout

export default Custom404
