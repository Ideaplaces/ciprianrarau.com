import classNames from 'classnames'
import Button from 'components/Button/Button'
import Tooltip from 'components/display/Tooltip'
import { useModal } from 'components/Modal/ModalContext'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { capitalize } from 'lodash'
import { VFC } from 'react'
import { HelpCircle, Settings } from 'react-feather'
import { useIntl } from 'react-intl'
import { CurrentUser, Maybe } from 'types/graphql'

import Preferences from './Preferences'

type MatchesMenuProps = {
  activeMatches: any
  menuOpen?: Maybe<boolean>
}

const MatchesMenu: VFC<MatchesMenuProps> = ({ activeMatches }) => {
  const { formatMessage } = useIntl()

  return (
    <div
      data-testid="matches-menu"
      className="flex items-center py-3 justify-between"
    >
      <div className="flex items-center">
        <div className="flex items-center">
          <h2 className="font-black text-2xl mr-8 mb-1">
            {formatMessage({ id: 'header.myMatches' })}
          </h2>
        </div>
        <Menu activeMatches={activeMatches} />
      </div>
      <div className="flex items-center">
        <HelpMessage />
        <MatchingPreferences />
      </div>
    </div>
  )
}

type MenuProps = {
  activeMatches: CurrentUser
}

const Menu: VFC<MenuProps> = ({ activeMatches }) => {
  const { formatMessage } = useIntl()
  const { mentorMatches, menteeMatches } = activeMatches

  const menuItems = [
    menteeMatches?.length > 0 && {
      id: 'mentee',
      name: formatMessage({ id: 'term.mentees' }),
    },
    mentorMatches?.length > 0 && {
      id: 'mentor',
      name: formatMessage({ id: 'term.mentors' }),
    },
  ]

  const filteredMenu = menuItems.filter((item) => item)

  return (
    <>
      {filteredMenu.length > 1 && (
        <div className="flex">
          {filteredMenu.map(
            (item) =>
              item && <MenuItem id={item.id} key={item.id} name={item.name} />
          )}
        </div>
      )}
    </>
  )
}

type MenuItemProps = {
  name: string
  id: string
}

const MenuItem: VFC<MenuItemProps> = ({ name, id }) => {
  const [activeTab, setActiveTab] = useQueryParam('type', StringParam)

  const active = activeTab === id

  return (
    <div onClick={() => setActiveTab(id)} className="cursor-pointer">
      <div
        className={classNames(
          'mr-4 py-4 px-3 w-28 rounded hover:bg-gray-400 hover:bg-white text-center',
          {
            'bg-white font-bold': active,
          }
        )}
      >
        {capitalize(name)}
      </div>
    </div>
  )
}

const HelpMessage = () => {
  const { formatMessage } = useIntl()

  const message = (
    <div className="leading-6">
      <div className="mb-4">
        {formatMessage({ id: 'text.tooltip.matches.start' })}
      </div>
      {formatMessage(
        { id: 'text.tooltip.matches.until' },
        { icon: <Settings className="inline" /> }
      )}
    </div>
  )

  return (
    <>
      <Tooltip text={message} position="left">
        <HelpCircle size="24" />
      </Tooltip>
    </>
  )
}

const MatchingPreferences: VFC = () => {
  const { showModal } = useModal()

  return (
    <>
      <Button
        onClick={() =>
          showModal({
            width: 'lg',
            content: <Preferences />,
          })
        }
        className="border-none w-4"
        variant="secondary"
        style={{ height: 'min-content' }}
      >
        <div className="flex items-center text-sm">
          <Settings size="24" />
        </div>
      </Button>
    </>
  )
}

export default MatchesMenu
