import filter from 'lodash/filter'

type Context = Record<string, any>

type Option = Record<string, any>

type OptionConfig = Option & { includeIf: boolean }

type OptionFn = (context: Context) => OptionConfig[]

const cleanOption = ({ includeIf, ...option }: OptionConfig) => option as Option

export const optionFilter = (options: OptionFn) => {
  return (context: Context) => {
    const result = options(context)

    return filter(result, (option) => option.includeIf).map(cleanOption)
  }
}
