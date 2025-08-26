import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Discipline } from 'types/graphql'

type EmptySubStateProps = {
  selectedDiscipline?: Discipline
}
const EmptySubState: FC<EmptySubStateProps> = ({ selectedDiscipline }) => {
  const { formatMessage } = useIntl()
  return (
    <p className="flex items-center p-2 h-12">
      {selectedDiscipline
        ? formatMessage(
            { id: 'phrase.noXforY' },
            {
              x: formatMessage({
                id: 'form.subdisciplines',
              }).toLowerCase(),
              y: selectedDiscipline?.name,
            }
          )
        : formatMessage({
            id: 'form.discipline',
          }).toLowerCase() +
          ' ' +
          formatMessage({
            id: 'form.requiredField',
          }).toLowerCase()}
    </p>
  )
}

export default EmptySubState
