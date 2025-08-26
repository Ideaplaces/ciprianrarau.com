import { gql } from '@apollo/client'
import classNames from 'classnames'
import Button from 'components/Button'
import MemberSelect from 'components/controls/MemberSelect'
import UserPill from 'components/display/UserPill'
import Spinner from 'components/feedback/Spinner'
import Modal from 'components/Modal'
import { useModal } from 'components/Modal/ModalContext'
import cookie from 'js-cookie'
import { useCurrentGroup } from 'lib/GroupContext'
import { UserMatchDataType } from 'lib/matching'
import { useState, VFC } from 'react'
import { Check, X } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  ManagedGroupAvatarsFieldsFragmentDoc,
  ManagedUserPillFieldsFragmentDoc,
  MentorMatchesFieldsFragment,
  useStageMatchesMutation,
} from 'types/graphql'

gql`
  fragment MatchFinderMemberFields on ManagedUser {
    name
    ...ManagedGroupAvatarsFields
    ...ManagedUserPillFields
  }
  ${ManagedGroupAvatarsFieldsFragmentDoc}
  ${ManagedUserPillFieldsFragmentDoc}
`

type MatchFinderProps = {
  member: MentorMatchesFieldsFragment
}

const MatchFinder: VFC<MatchFinderProps> = ({ member }) => {
  const { formatMessage } = useIntl()
  const { hideModal } = useModal()
  const { currentGroup } = useCurrentGroup()

  const [selectedMembers, setSelectedMembers] = useState<UserMatchDataType[]>(
    []
  )
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [stageMatches] = useStageMatchesMutation({
    refetchQueries: ['allMatches'],
  })

  const handleActivate = async () => {
    const variables = { ids: selectedMembers.map((m) => m.matchId) }

    if (cookie.get('firstTimeActivateMatch') === 'true') {
      setSubmitting(true)
      try {
        await stageMatches({ variables })
        toast.success(formatMessage({ id: 'tooltip.success' }))
        setSubmitting(false)
        hideModal()
      } catch (e) {
        console.error(e)
        toast.error(formatMessage({ id: 'term.error' }))
        setSubmitting(false)
      }
    } else {
      setModalOpen(true)
      cookie.set('firstTimeActivateMatch', 'true', { expires: 365 })
    }
  }

  const placeholder = formatMessage(
    { id: 'tooltip.searchFor' },
    {
      term: formatMessage({
        id: currentGroup.manualMatching
          ? 'text.topSuggestions'
          : 'term.members',
      }).toLowerCase(),
    }
  )

  return (
    <>
      <Modal open={modalOpen} close={() => setModalOpen(false)}>
        <div className="p-8">
          <div className="text-3xl font-black">
            {formatMessage({ id: 'prompt.areYouSure' })}
          </div>
          <div className="my-5">
            {formatMessage(
              {
                id: 'text.stageMatchesConfirm',
              },
              {
                b: function makeBold(text) {
                  return <b>{text}</b>
                },
              }
            )}
          </div>
          <Button onClick={handleActivate} loading={submitting}>
            {formatMessage({ id: 'button.confirm' })}
          </Button>
        </div>
      </Modal>
      <div className="flex font-bold text-lg items-center">
        {formatMessage({ id: 'term.match' })}
        <UserPill user={member} className="mx-1" />
        {formatMessage({ id: 'term.with' })}...
      </div>
      <div>
        <MemberSelect
          type="matches"
          placeholder={placeholder}
          onValueChange={setSelectedMembers}
          searchbarClassNames="pb-2"
          otherClassNames="h-48 lg:h-60 pb-1"
          className="pb-6"
          inline
          listPosition="TOP"
          memberId={member.id}
          showDefaultUsers
          isMulti
        />
        {selectedMembers?.length > 0 && (
          <Buttons
            closeFinder={hideModal}
            handleActivate={handleActivate}
            selectedMembers={selectedMembers}
            submitting={submitting}
          />
        )}
      </div>
    </>
  )
}

type ButtonsProps = {
  closeFinder: (...args: any) => void
  handleActivate: (...args: any) => void
  selectedMembers: (UserMatchDataType | string)[]
  submitting?: boolean
}

const Buttons: VFC<ButtonsProps> = ({
  closeFinder,
  handleActivate,
  selectedMembers,
  submitting,
}) => {
  const { formatMessage } = useIntl()
  return (
    <div className="flex w-full items-center justify-center">
      <button
        color="red"
        onClick={closeFinder}
        className="p-2 mr-2 flex items-center justify-center bg-red w-1/2 bg-opacity-5 hover:bg-opacity-10 border rounded border-darkGray"
      >
        <X className="text-red mr-1" />
        <div>{formatMessage({ id: 'button.discard' })}</div>
      </button>

      <button
        className="p-2 flex items-center relative justify-center bg-green bg-opacity-10 hover:bg-opacity-20 border w-1/2 rounded border-darkGray"
        disabled={!selectedMembers || selectedMembers.length === 0}
        onClick={handleActivate}
      >
        {submitting && (
          <div className={`absolute inset-0 flex justify-center items-center`}>
            <Spinner />
          </div>
        )}

        <Check
          className={classNames('text-green mr-1', {
            'opacity-0': submitting,
          })}
        />
        <div className={classNames({ 'opacity-0': submitting })}>
          {formatMessage(
            {
              id:
                selectedMembers?.length > 1
                  ? 'button.stageMatches'
                  : 'button.stageMatch',
            },
            { n: selectedMembers?.length }
          )}
        </div>
      </button>
    </div>
  )
}

export default MatchFinder
