import { createContext, FC, ReactNode, useContext } from 'react'

type IndexContextProps = {
  rowIndex?: number
}

const IndexContext = createContext<IndexContextProps>({
  rowIndex: undefined,
})

type IndexProviderProps = {
  data: IndexContextProps
  children: ReactNode
}

export const IndexProvider: FC<IndexProviderProps> = ({ data, children }) => {
  return <IndexContext.Provider value={data}>{children}</IndexContext.Provider>
}

export const useIndex = () => {
  return useContext(IndexContext)
}

export default IndexContext
