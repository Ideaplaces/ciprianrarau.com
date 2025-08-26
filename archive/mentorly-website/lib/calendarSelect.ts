import { capitalize } from 'lodash'
import { useIntl } from 'react-intl'
import { ConnectionInfo } from 'types/graphql'

type ProvidersType = ConnectionInfo[]
type ConnectionsType = Record<string, any>

const useCalendarSelect = (
  providers: ProvidersType,
  connections: ConnectionsType
) => {
  const { formatMessage } = useIntl()

  const mentorlyOption = {
    label: capitalize(
      formatMessage({
        id: 'term.default',
      })
    ),
    value: 'internal',
  }

  const customUrlOption = {
    label: capitalize(
      formatMessage({
        id: 'text.importCalendar',
      })
    ),
    value: 'calendarUrl',
  }

  const convertToOption = (v: string) => {
    const disconnected = connections && !connections[v]?.connected

    if (!v || v === 'internal') {
      return mentorlyOption
    }

    if (v === 'calendarUrl') {
      return customUrlOption
    }

    const disconectedMsg = disconnected ? ' (disconnected)' : ''

    return {
      label: capitalize(v) + disconectedMsg,
      value: v,
      disconnected: disconnected,
    }
  }

  const options =
    providers &&
    [
      mentorlyOption,
      ...providers.map((p) => convertToOption(p.id)),
      customUrlOption,
    ].filter(Boolean)

  return { convertToOption, options }
}

export { useCalendarSelect }
