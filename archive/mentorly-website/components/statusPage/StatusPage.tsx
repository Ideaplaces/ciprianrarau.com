import BlankLayout from 'components/BlankLayout'
import LogoSelect, { LogoSelectGroup } from 'components/general/LogoSelect'
import { FC, ReactNode } from 'react'

export type StatusPageProps = {
  group?: LogoSelectGroup
  subTitle?: string
  title?: string
  children: ReactNode
}

const StatusPage: FC<StatusPageProps> = ({
  group,
  subTitle,
  title,
  children,
}) => {
  return (
    <BlankLayout>
      <div className="mb-8 h-16">
        <LogoSelect group={group} />
      </div>
      <h1 className="text-2xl mb-4 font-bold">{title}</h1>
      {subTitle && <h2 className="text-2xl mb-2">{subTitle}</h2>}
      <div>{children}</div>
    </BlankLayout>
  )
}

export default StatusPage
