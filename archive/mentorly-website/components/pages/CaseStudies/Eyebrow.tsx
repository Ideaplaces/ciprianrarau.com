import { H3 } from 'components/Headings'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

type EyebrowProps = {
  number: number | string
  title: string
}
const Eyebrow: VFC<EyebrowProps> = ({ number, title }) => {
  const { formatMessage } = useIntl()

  return (
    <div>
      <p className="pb-2">
        {formatMessage({ id: 'useCases.useCase' }, { number })}
      </p>
      <H3>{title}</H3>
    </div>
  )
}

export default Eyebrow
