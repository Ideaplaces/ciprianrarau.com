import classNames from 'classnames'
import Button from 'components/Button/Button'
import DropdownButton from 'components/Button/DropdownButton'
import ResponsiveCTAButton from 'components/Button/ResponsiveCTAButton'
import EditCalendarUrl from 'components/Calendar/EditCalendarUrl'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import Filters from 'components/Filters/Filters'
import NewSession from 'components/Forms/Session/NewSession'
import SocialIcon from 'components/icons/SocialIcon'
import { useModal } from 'components/Modal/ModalContext'
import { format } from 'date-fns'
import { useCalendarProps } from 'lib/calendarProps'
import { useCurrentGroup } from 'lib/GroupContext'
import { optionFilter } from 'lib/optionFilter'
import { useRouter } from 'lib/router'
import { calendarProviderUrl, settingsUrl } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { capitalize } from 'lodash'
import { useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Edit,
  ExternalLink,
  HelpCircle,
  Home,
  Link as LinkIcon,
  Tool,
} from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useUpdateUserMutation } from 'types/graphql'

import NavLink from './NavLink'

const mainDropdownButtonOptionFactory = optionFilter(
  ({ calendarUrlProvider, externalProvider, editing, setEditing }) => [
    {
      id: `Connected to calendar URL`,
      icon: <LinkIcon className="text-darkerGray" />,
      includeIf: !!calendarUrlProvider,
    },
    {
      id: `Connected`,
      icon: <SocialIcon type="default" />,
      includeIf: !!externalProvider,
    },
    {
      id: editing ? 'save' : 'edit',
      onClick: () => setEditing(!editing),
      icon: editing ? <Check /> : <Edit />,
      includeIf: true,
    },
  ]
)

const dropdownButtonOptionsFactory = optionFilter(
  ({ calendarUrlProvider, provider, fetchRange, settingsUrl }) => [
    {
      id: 'yourCalendarUrl',
      data: capitalize(provider),
      icon: <ExternalLink />,
      href: calendarProviderUrl(provider),
      customComponent: <EditCalendarUrl fetchRange={fetchRange} />,
      includeIf: !!calendarUrlProvider,
    },
    {
      id: 'editCalendarSettings',
      icon: <Tool />,
      href: settingsUrl,
      includeIf: true,
    },
  ]
)

type CalendarToolbarProps = {
  view: 'week' | 'month' | 'day'
  views: string[]
  date: Date
  editing: boolean
  label: string
  setEditing: (value: boolean) => void
  calendarProvider: string
}

const CalendarToolbar = ({
  view,
  views,
  date,
  editing,
  label,
  setEditing,
  calendarProvider,
}: CalendarToolbarProps) => {
  const { formatMessage, locale } = useIntl()
  const [disconnecting, setDisconnecting] = useState(false)
  const { currentUser } = useCurrentUser()
  const { push } = useRouter()
  const { isDashboard, currentGroup } = useCurrentGroup()
  const { showModal, hideModal } = useModal()

  const base = isDashboard ? 'dashboard/sessions/' : 'personal/calendar/'

  const { fetchRange, filter, setFilter } = useCalendarProps()

  const params = filter && `filter=${filter}`

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['viewerTimeSlots', 'viewerConnections'],
  })

  if (!currentUser) return null

  const toggleModal = (modalContent: string) => {
    return modalContent === 'new'
      ? showModal({
          width: 'md',
          padding: 'p-3',
          content: <NewSession onCancel={hideModal} />,
        })
      : showModal({
          width: 'sm',
          padding: 'p-6',
          content: (
            <div className="p-8">
              <div className="font-black text-2xl mb-4">
                {formatMessage({ id: 'prompt.areYouSure' })}
              </div>
              <Button onClick={handleDisconnect} loading={disconnecting}>
                {formatMessage({ id: 'button.confirm' })}
              </Button>
            </div>
          ),
        })
  }

  const handleDisconnect = () => {
    setDisconnecting(true)
    updateUser({
      variables: {
        id: currentUser.id,
        attributes: {
          calendarProvider: 'internal',
          availabilityCalendarId: '',
          calendarId: '',
          calendarUrl: '',
        },
      },
      refetchQueries: ['viewerTimeSlots', 'viewerConnections'],
    })
      .then(() => {
        toast.success(formatMessage({ id: 'term.saved' }))
        setDisconnecting(false)
        hideModal()
      })
      .catch((e) => {
        setDisconnecting(false)
        hideModal()
        toast.error(
          formatMessage({
            id: 'toast.error.updateUser',
          })
        )
        console.error(e)
      })
  }

  const provider = calendarProvider
  const internalProvider = provider === 'internal'
  const calendarUrlProvider = provider === 'calendarUrl'
  const externalProvider = !internalProvider && !calendarUrlProvider

  const mainDropdownButtonOption = mainDropdownButtonOptionFactory({
    calendarUrlProvider,
    externalProvider,
    editing,
    setEditing,
  })[0]

  const dropdownButtonOptions = dropdownButtonOptionsFactory({
    externalProvider,
    calendarUrlProvider,
    internalProvider,
    provider,
    disconnecting,
    fetchRange,
    settingsUrl: settingsUrl(locale, currentGroup, '/connections'),
    toggleModal,
  })

  const preventUserEdit = getFeatureFlag(currentGroup, 'preventEditEvents', {
    user: currentUser,
    isActingAsMentor: currentUser.mentor,
  }) as boolean

  const cannotEditTooltip =
    formatMessage({ id: 'tooltip.cannotEdit' }) +
    ' ' +
    formatMessage({ id: 'tooltip.contactPM' })

  const sessionOptions = [
    { id: undefined, name: 'All' },
    {
      id: 'individual_session',
      name: formatMessage({ id: 'term.individualSession' }),
    },
    {
      id: 'group_session',
      name: formatMessage({ id: 'term.groupSession' }),
    },
    {
      id: 'masterclass',
      name: formatMessage({ id: 'term.masterclass' }),
    },
  ]

  //   <Spinner />

  const CTAbutton = isDashboard ? (
    <ResponsiveCTAButton
      responsive={false}
      messageId="header.createSession"
      onClick={() => toggleModal('new')}
    />
  ) : (
    <DropdownButton
      mainOption={mainDropdownButtonOption}
      options={dropdownButtonOptions}
      className="ml-0 lg:ml-2 whitespace-nowrap"
      dropdownIcon={!calendarProvider && <DownloadCloud size="16" />}
      noDropdown={!getFeatureFlag(currentGroup, 'calendar.socialSync')}
      disabled={preventUserEdit || !provider}
      tooltip={preventUserEdit ? cannotEditTooltip : undefined}
    />
  )

  if (!currentUser) return null

  const { calendarUrl } = currentUser

  const helpUrl = formatMessage({
    id: calendarUrl ? 'url.calSyncHelp' : 'url.availabilityHelp',
  })

  const setUrl = (value: 'week' | 'month' | 'day') => {
    date &&
      push(
        `/${locale}/${base}${value || 'month'}/${format(date, 'yyyy-MM-dd')}${
          params ? '/?' + params : ''
        }`
      )
  }

  const hideCTA = false

  return (
    <div className="mt-2 mb-0">
      <div className="flex flex-col w-full bg-gray justify-center sm:justify-between items-center mb-0 lg:sticky z-20 xl:flex-row">
        <div className="flex w-auto items-center space-x-2 mb-5 flex-wrap justify-center">
          <h1 className="font-black text-xl whitespace-nowrap w-auto">
            {label}
          </h1>
          <div className="flex items-center justify-center">
            <NavLink
              date={date}
              calendarView={view}
              navigation="prev"
              editing={editing}
            >
              <ChevronLeft />
            </NavLink>
            <NavLink
              date={date}
              calendarView={view}
              navigation="today"
              editing={editing}
            >
              <Home />
            </NavLink>
            <NavLink
              date={date}
              calendarView={view}
              navigation="next"
              editing={editing}
            >
              <ChevronRight />
            </NavLink>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center space-x-3">
          <div className="flex items-center gap-2 mb-5">
            {sessionOptions.length > 2 && (
              <Filters
                name="sessionType"
                className={classNames(
                  'mr-0 whitespace-nowrap border mb-0 border-darkGray rounded p-[2px] bg-lightGray hover:bg-gray',
                  { 'bg-mediumGray hover:bg-mediumGray': editing }
                )}
                options={sessionOptions}
                selection={filter}
                setSelection={setFilter}
                disabled={editing}
              />
            )}
            <Filters
              name="view"
              className={classNames(
                'mr-0 whitespace-nowrap border mb-0 border-darkGray rounded p-[2px] bg-lightGray hover:bg-gray',
                { 'bg-mediumGray hover:bg-mediumGray': editing }
              )}
              options={views?.map((v) => {
                return { id: v, name: capitalize(v) }
              })}
              selection={view}
              setSelection={(v) => setUrl(v)}
              disabled={editing}
            />
          </div>
          {CTAbutton && !hideCTA && (
            <div className="flex items-center my-auto space-x-2 mb-5">
              {CTAbutton}
              {!isDashboard && (
                <button
                  onClick={() => window.open(helpUrl)}
                  className="cursor-pointer hover:opacity-75 transition duration-150"
                >
                  <HelpCircle size={24} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {editing && (
        <Alert>{formatMessage({ id: 'alert.editAvailabilities' })}</Alert>
      )}
    </div>
  )
}

CalendarToolbar.displayName = 'CalendarToolbar'

export default CalendarToolbar
