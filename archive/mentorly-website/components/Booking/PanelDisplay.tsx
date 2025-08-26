import { FC, ReactNode } from 'react'

type PanelDisplayProps = {
  children: ReactNode
}

const PanelDisplay: FC<PanelDisplayProps> = ({ children }) => (
  <div className="pt-2 flex space-x-6 md:space-x-8 flex-1 ml-1">
    <div className="w-full md:justify-between flex flex-col md:flex-row space-y-6 md:space-y-0">
      {children}
    </div>
  </div>
)

export default PanelDisplay
