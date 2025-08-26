import Button from 'components/Button'
import DatePicker from 'components/controls/DatePicker'
import DurationSelect from 'components/controls/DurationSelect'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import MemberSelect from 'components/controls/MemberSelect'
import Textarea from 'components/controls/Textarea'
import Alert from 'components/feedback/Alert'
import DateTime from 'components/Sessions/DateTime'
import { FormikState, FormikValues } from 'formik'
import { programEventBoundaries } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { userIsPM } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { camelCase, compact, map } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { DateTimeFieldsFragment } from 'types/graphql'

import { groupSessionSchema, masterclassSchema } from './Schemas'

type SessionFormProps = {
  initialValues: FormikValues
  onSubmit: (...args: any) => void
  onCancel: (...args: any) => void
  enableReinitialize?: boolean
  allowHosts?: boolean
  sessionType: string
  action: 'edit' | 'create'
  booking?: DateTimeFieldsFragment
}
const SessionForm: VFC<SessionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  enableReinitialize,
  allowHosts,
  sessionType,
  action,
  booking,
}) => {
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { back } = useRouter()

  if (!currentUser || !currentGroup) return null

  const setMentor = isDashboard && userIsPM(currentUser, currentGroup)

  const schemas = {
    group_session: groupSessionSchema({ setMentor }),
    masterclass: masterclassSchema({ setMentor, allowHosts }),
  }

  const schema = schemas[sessionType as keyof typeof schemas]

  if (!schema) {
    return (
      <Alert
        description={formatMessage({ id: 'error.unknownSessionType' })}
        type="error"
        showIcon
      />
    )
  }

  const { calendarStart, calendarEnd, programEnded } =
    programEventBoundaries(currentGroup)

  if (programEnded) {
    return (
      <Alert
        description={formatMessage({ id: 'form.program.completed' })}
        type="error"
        showIcon
      />
    )
  }

  return (
    <Form
      className="max-w-3xl"
      id="sessions"
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={schema}
      enableReinitialize={enableReinitialize}
      validateOnChange={false}
      validateOnBlur={false}
      showErrorSummary
    >
      {({ isSubmitting, values }: FormikState<FormikValues>) => (
        <>
          {action === 'edit' && booking && (
            <Alert className="mb-5 mt-1" type="subtle">
              <DateTime booking={booking} hideAddToCal />
            </Alert>
          )}
          {!isDashboard && (
            <Alert showIcon className="mb-4 max-w-3xl">
              {formatMessage({ id: 'header.description.createSession' })}
            </Alert>
          )}
          {setMentor && (
            <Field
              name="mentor"
              type="select"
              control={MemberSelect}
              segment="mentor"
              omitIds={compact([
                ...map(values?.hosts, 'id'),
                ...map(values?.guests, 'id'),
              ])}
              placeholder={formatMessage({
                id: 'placeholder.enterUserName',
              })}
            />
          )}
          {allowHosts && sessionType === 'masterclass' && (
            <Field
              name="hosts"
              type="select"
              readOnly={action !== 'create'}
              control={MemberSelect}
              omitIds={compact([
                values?.mentor?.id,
                ...map(values?.guests, 'id'),
              ])}
              segment="mentor"
              isMulti
              placeholder={formatMessage({
                id: 'placeholder.enterUserName',
              })}
            />
          )}
          {sessionType !== 'individualSession' && (
            <>
              <Field
                name="title"
                autoComplete="off"
                placeholder={formatMessage({
                  id: `placeholder.sessionTitle`,
                })}
              />
              <Field
                name="description"
                autoComplete="off"
                control={Textarea}
                placeholder={formatMessage({
                  id: 'form.placeholder.describeSessionHere',
                })}
                label={formatMessage({
                  id: `form.label.${camelCase(sessionType)}`,
                })}
              />
            </>
          )}
          {sessionType === 'masterclass' && (
            <>
              <div className="flex space-between grow">
                <div className="w-1/2 mr-3">
                  {/* @TODO: add tooltip to explain participants = guests + hosts, not including mentor */}
                  <Field
                    name="minParticipants"
                    type="number"
                    controlClassName="w-full"
                    autoComplete="off"
                    min={0}
                    max={100}
                  />
                </div>
                <div className="w-1/2">
                  <Field
                    name="maxParticipants"
                    type="number"
                    controlClassName="w-full"
                    autoComplete="off"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </>
          )}
          {action === 'create' && (
            <div className="flex">
              <div className="fullwidth-react-datepicker mr-3 w-1/2">
                <Field
                  name="startTime"
                  minDate={calendarStart}
                  maxDate={calendarEnd}
                  type="date"
                  control={DatePicker}
                  customDateFormat="Pp"
                  showTimeSelect
                  placeholder={formatMessage({ id: 'term.selectDate' })}
                />
              </div>
              <div className="w-1/2">
                <Field
                  name="duration"
                  type="select"
                  control={DurationSelect}
                  maxValue={135}
                  step={15}
                />
              </div>
            </div>
          )}
          {sessionType !== 'individualSession' && (
            <Field
              name="guests"
              type="select"
              control={MemberSelect}
              group={currentGroup}
              omitIds={
                setMentor
                  ? compact([...map(values?.hosts, 'id'), values?.mentor?.id])
                  : compact([
                      currentUser?.id,
                      ...map(values?.hosts, 'id'),
                      values?.mentor?.id,
                    ])
              }
              isMulti
              placeholder={formatMessage({
                id: 'placeholder.enterUserName',
              })}
              label={
                action === 'edit'
                  ? formatMessage({ id: 'label.invitedGuests' })
                  : undefined
              }
            />
          )}
          <div className="flex items-center">
            <Button loading={isSubmitting} type="submit" className="my-2">
              {formatMessage({
                id: `button.save`,
              })}
            </Button>

            {/* type="button" must be present to prevent this button from submitting the form */}
            <button
              className="ml-5"
              onClick={() => (onCancel ? onCancel() : back())}
              type="button"
            >
              {formatMessage({ id: 'button.cancel' })}
            </button>
          </div>
        </>
      )}
    </Form>
  )
}

export default SessionForm
