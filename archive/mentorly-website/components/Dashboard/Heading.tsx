import { FC, ReactNode } from 'react'

type ChildType = {
  children: ReactNode
}

const Heading = ({ children }: ChildType): JSX.Element => {
  return (
    <div className="flex justify-between items-center mb-6">{children}</div>
  )
}

const Text: FC<ChildType> = ({ children }) => {
  return <div className="text-3xl font-black">{children}</div>
}

const Actions: FC<ChildType> = ({ children }) => {
  return <div className="flex gap-4">{children}</div>
}

Heading.Text = Text
Heading.Actions = Actions

export default Heading
