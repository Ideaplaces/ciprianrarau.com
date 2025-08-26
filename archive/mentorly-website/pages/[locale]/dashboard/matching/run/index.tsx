import { gql } from '@apollo/client'
import Button, { ButtonLink } from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import Tooltip from 'components/display/Tooltip'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Info } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useRunAutomaticMatchingMutation } from 'types/graphql'
import * as Yup from 'yup'

gql`
  mutation runAutomaticMatching(
    $groupId: ID!
    $menteeSlots: Int!
    $mentorSlots: Int!
  ) {
    runAutomaticMatching(
      groupId: $groupId
      menteeSlots: $menteeSlots
      mentorSlots: $mentorSlots
    ) {
      errorDetails
      status {
        id
        status
      }
    }
  }
`

const initialValues = {
  menteeSlots: 2,
  mentorSlots: 2,
}

const validationSchema = Yup.object().shape({
  menteeSlots: Yup.number().positive().integer().required(),
  mentorSlots: Yup.number().positive().integer().required(),
})

const Run = () => {
  const router = useRouter()
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [runAutomaticMatchingMutation] = useRunAutomaticMatchingMutation()

  const handleSubmit = async (values: any) => {
    const { data, errors } = await runAutomaticMatchingMutation({
      variables: {
        groupId: currentGroup.id,
        menteeSlots: values.menteeSlots,
        mentorSlots: values.mentorSlots,
      },
      refetchQueries: ['allMatches'],
    })

    if (errors) {
      return toast.error('An error occured')
    }

    const jobId = data?.runAutomaticMatching?.status?.id

    router.push(`/${locale}/dashboard/matching/run/${jobId}`)
  }

  return (
    <div className="max-w-4xl">
      <Heading>
        <Heading.Text>
          {formatMessage({ id: 'header.automaticMatching' })}
        </Heading.Text>
      </Heading>
      <Panel>
        <Panel.Body>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-bold">
                {formatMessage({ id: 'header.matchingParameters' })}
              </h2>
              <Tooltip
                text={
                  <div>
                    {formatMessage({ id: 'tooltip.learnAboutSmartMatching' })}
                  </div>
                }
                link={{
                  href: 'https://help.mentorly.co/en/articles/5596082-smart-matching',
                  label: 'Learn more',
                }}
                enterable={true}
              >
                <div className="flex items-center ml-2">
                  <Info size={20} className="text-accentColor" />
                </div>
              </Tooltip>
            </div>
            <p className="text-darkerGray text-sm mb-6">
              {formatMessage({ id: 'text.automaticMatching.description' })}
            </p>
          </div>
          <Form
            id="runMatching"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }: { isSubmitting: boolean }) => (
              <>
                <Field
                  name="menteeSlots"
                  type="number"
                  label={formatMessage({ id: 'form.menteeSlots' })}
                  min={1}
                  max={10}
                />
                <Field
                  name="mentorSlots"
                  type="number"
                  label={formatMessage({ id: 'form.mentorSlots' })}
                  min={1}
                  max={10}
                />
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {formatMessage({ id: 'button.runMatching' })}
                  </Button>
                  <Link href={`/${locale}/dashboard/matching`}>
                    <ButtonLink variant="secondary">
                      {formatMessage({ id: 'button.back' })}
                    </ButtonLink>
                  </Link>
                </div>
              </>
            )}
          </Form>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Run.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Run)
export default Run
