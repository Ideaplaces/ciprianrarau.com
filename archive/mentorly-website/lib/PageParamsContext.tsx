import { createContext, ReactNode, useContext, VFC } from 'react'

type PageParamsContextType = {
  groupId: string | null
}

const PageParamsContext = createContext<PageParamsContextType>({
  groupId: null,
})

type PageParamsProviderType = {
  children: ReactNode
  groupId: string
}

export const PageParamsProvider: VFC<PageParamsProviderType> = ({
  children,
  groupId,
}) => {
  return (
    <PageParamsContext.Provider
      value={{
        groupId,
      }}
    >
      {children}
    </PageParamsContext.Provider>
  )
}

export const usePageParams = () => {
  return useContext(PageParamsContext)
}

export default PageParamsContext
