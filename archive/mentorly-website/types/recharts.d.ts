import type { LegendProps, XAxisProps } from 'recharts'
import type { CategoricalChartProps } from 'recharts/types/chart/generateCategoricalChart'

declare module 'recharts' {
  export type LegendPayload = NonNullable<LegendProps['payload']>[0]
  export type AxisDomain = NonNullable<XAxisProps['domain']>
  export type ComposedChartProps = CategoricalChartProps
  export type LineChartProps = CategoricalChartProps
}
