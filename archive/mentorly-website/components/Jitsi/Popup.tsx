import { FC, ReactNode } from 'react'

type PopupProps = {
  children: ReactNode
}

const Popup: FC<PopupProps> = ({ children }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
      <div className="left-auto right-auto bg-white p-4 rounded">
        {children}
      </div>
    </div>
  )
}
export default Popup
