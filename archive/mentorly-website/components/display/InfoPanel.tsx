import { VFC } from 'react'
import { Icon } from 'react-feather'

export type InfoPanelProps = {
  icon: Icon
  title: string
  number: number | string
}

export const InfoPanel: VFC<InfoPanelProps> = ({ icon, title, number }) => {
  const Icon = icon
  return (
    <div className="h-24 flex w-full bg-white">
      <div className="bg-primary h-full flex justify-center items-center w-20">
        <Icon />
      </div>
      <div className="flex flex-col h-24 justify-center w-full ml-8">
        <div className="text-sm">{title}</div>
        <div className="font-black text-3xl">{number}</div>
      </div>
    </div>
  )
}
