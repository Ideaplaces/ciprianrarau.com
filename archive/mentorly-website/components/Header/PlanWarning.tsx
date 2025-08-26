import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import Alert from 'components/feedback/Alert'
import { differenceInDays, parseISO } from 'date-fns'
import { apiUrl } from 'lib/urls'
import { TrialInfoFieldsFragment } from 'types/graphql'

gql`
  fragment TrialInfoFields on Account {
    requiresPlan
    slug
    trialEndsAt
  }
`

type PlanWarningProps = {
  account: TrialInfoFieldsFragment
}

export const PlanWarning = ({ account }: PlanWarningProps) => {
  if (!account.requiresPlan || !account.trialEndsAt) {
    return null
  }

  const trialEnd = parseISO(account.trialEndsAt)
  const delta = differenceInDays(trialEnd, new Date()) + 1
  const href = apiUrl('en', `/accounts/${account.slug}/checkout`)

  if (delta < 0) {
    return (
      <Alert type="warning">
        <div className="flex items-center justify-between gap-4">
          <p>Your trial is over. Please subscribe to keep using Mentorly.</p>
          <ButtonLink href={href}>Subscribe</ButtonLink>
        </div>
      </Alert>
    )
  }

  return (
    <Alert type="info">
      <div className="flex items-center justify-between gap-4">
        <p>
          You have <strong>{delta} days</strong> left on your trial. Please
          subscribe to keep using Mentorly after your trial ends.
        </p>
        <ButtonLink href={href}>Subscribe</ButtonLink>
      </div>
    </Alert>
  )
}

export default PlanWarning
