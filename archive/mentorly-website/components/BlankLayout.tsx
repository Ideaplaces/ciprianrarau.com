import { FC, ReactNode } from 'react'

type BlankLayoutProps = {
  children: ReactNode
}

const BlankLayout: FC<BlankLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center z-0">
      {children}
    </div>
  )
}

export default BlankLayout
