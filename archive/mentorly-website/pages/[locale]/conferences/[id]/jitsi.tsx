import Layout from 'components/BlankLayout'
import { ButtonLink } from 'components/Button'
import Conversation from 'components/Chat/Conversation'
import ConferenceWrapper from 'components/ConferenceWrapper'
import Form from 'components/controls/Form'
import Feature from 'components/Feature'
import Jitsi from 'components/Jitsi'
import Timer from 'components/Jitsi/Timer'
import Modal from 'components/Modal'
import { useMoveElementLeft } from 'lib/DOMInteraction'
import env from 'lib/env'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { camelCase } from 'lodash'
import { useEffect, useState } from 'react'
import { MessageCircle } from 'react-feather'
import { useIntl } from 'react-intl'

const JitsiConference = () => {
  const { currentUser } = useCurrentUser()
  const { locale, formatMessage } = useIntl()
  const [messageNotification, setMessageNotification] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [endCallModal, setEndCallModal] = useState(false)

  useEffect(() => {
    const intercom = window.Intercom
    intercom &&
      intercom('update', {
        hide_default_launcher: true,
      })
  }, [])

  useMoveElementLeft('.intercom-lightweight-app-messenger', 20)
  useMoveElementLeft('[title="Intercom live chat message"]', 20)
  useMoveElementLeft('.intercom-messenger-frame', 20)

  return (
    <ConferenceWrapper>
      {(booking) => {
        if (!booking) {
          console.error('no booking found')
          return null
        }

        const isHost =
          booking.hosts.some((host) => host.id === currentUser.id) ||
          currentUser.id === booking.mentor?.id

        const handleReadyToClose = () => {
          window.location.href = `/${locale}/sessions/${booking.id}/review`
        }

        const chatWindowHandler = () => {
          setShowChat((value) => !value)
          !showChat && setMessageNotification(false)
        }

        const handleNotification = (condition: boolean) => {
          condition && !showChat && setMessageNotification(condition)
        }

        return (
          <>
            <Modal open={endCallModal} close={() => setEndCallModal(false)}>
              <div className="flex flex-col justify-center p-5">
                <div className="p-10 text-justify">
                  {formatMessage({ id: 'text.reportAbuseModal' })}
                </div>
                <ButtonLink
                  href={`/${locale}/sessions/${booking.id}/review?action=abuse`}
                >
                  {formatMessage({ id: 'button.reportAbuse2' })}
                </ButtonLink>
              </div>
            </Modal>
            {/* header */}
            <div className="flex flex-0 h-10 w-full bg-backgroundColor px-4 py-2 font-bold justify-between items-center">
              {booking && (
                <Feature id="sessionTimer">
                  <Timer
                    bookingId={booking.id}
                    endCall={handleReadyToClose}
                    isHost={isHost}
                  />
                </Feature>
              )}
              {env.development && (
                <p className="px-2 bg-red text-white mx-auto rounded">
                  mic and video will not work in local env
                </p>
              )}
              <Feature id="messaging">
                <div className="relative mt-1 ml-auto">
                  {messageNotification && (
                    <div className="absolute bg-red rounded-lg w-3 h-3 right-0 mr-1" />
                  )}
                  <button onClick={chatWindowHandler}>
                    <MessageCircle color={'var(--backgroundTextColor)'} />
                  </button>
                </div>
              </Feature>
            </div>

            {/* body */}
            <div className="flex flex-0 h-full w-full overflow-scroll">
              {/* conference */}
              <div className="relative h-full w-full">
                <Jitsi
                  conferenceId={booking.id}
                  roomName={booking.jitsiRoomId}
                  subject={
                    booking.title ||
                    formatMessage({
                      id: `term.${camelCase(booking.sessionType)}`,
                    })
                  }
                  jwt={booking.jitsiToken || ''}
                  onReadyToClose={handleReadyToClose}
                  isAdmin={isHost}
                />
                <div className="absolute ml-5 left-0 bottom-0 mr-2 mb-2">
                  <button
                    className="bg-white rounded p-1 rounded-r-none px-3 text-sm hover:bg-gray"
                    onClick={() => setEndCallModal(true)}
                  >
                    {formatMessage({ id: 'button.reportAbuse' })}
                  </button>
                  <button
                    id="custom_intercom_button"
                    className="bg-white rounded rounded-l-none p-1 px-3 border-l border-darkGray text-sm hover:bg-gray"
                  >
                    {formatMessage({ id: 'button.getSupport' })}
                  </button>
                </div>
              </div>
              {/* chat */}
              <Feature id="messaging">
                <div
                  className={`flex flex-col bg-white h-full w-6/12 sm:w-5/12 md:w-4/12 ${
                    showChat ? '' : 'hidden'
                  }`}
                >
                  <Form
                    id="jitsiConversationEmbeded"
                    className="h-full overflow-auto"
                    initialValues={{}}
                    onSubmit={() => undefined}
                  >
                    {() => (
                      <Conversation
                        id={booking.conversation?.id}
                        setMessageNotification={handleNotification}
                      />
                    )}
                  </Form>
                </div>
              </Feature>
            </div>
          </>
        )
      }}
    </ConferenceWrapper>
  )
}

JitsiConference.Layout = Layout
export const getServerSideProps = connectServerSideProps(JitsiConference)
export default JitsiConference

// year-long session for testing (Jan 18, 2022 - 2023)
// with all members of test group participating
// http://test.localtest.me:3010/en/sessions/UL9_Oido2WDAeWtOJNkClQ
// http://test.mentorly.dev/en/sessions/UL9_Oido2WDAeWtOJNkClQ
