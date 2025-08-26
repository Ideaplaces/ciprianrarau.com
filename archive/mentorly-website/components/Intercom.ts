import useIntercom, { IntercomSettings } from '@mentorly/react-intercom-hook'
import { useCurrentUser } from 'lib/UserContext'
import { capitalize } from 'lodash'
import { VFC } from 'react'

type CurrentIntercomUserType = {
  id: string
  intercomHash: string
  contactEmail: string
  name: string
  userRole: string
  avatar: {
    imageUrl: string
  }
  group: {
    id: string
    name: string
    slug: string
    plan: {
      id: string
      name: string
    }
  }
}

const prepareIntercomProps = (
  currentUser: CurrentIntercomUserType,
  appId: string
) => {
  const intercomProps = {
    app_id: appId,
    custom_launcher_selector: '#custom_intercom_button',
  } as IntercomSettings

  if (!currentUser) {
    return intercomProps
  }

  const email = currentUser.contactEmail
  const domain = email.split('@')[1]

  if (domain.includes('mentorly')) {
    return undefined
  }

  intercomProps.user_id = currentUser.id
  intercomProps.user_hash = currentUser.intercomHash
  intercomProps.email = currentUser.contactEmail
  intercomProps.name = currentUser.name
  intercomProps.Role = capitalize(currentUser.userRole)

  if (currentUser.avatar.imageUrl) {
    intercomProps.avatar = {
      type: 'avatar',
      image_url: currentUser.avatar.imageUrl,
    }
  }

  if (currentUser.group) {
    intercomProps.Marketplace = false
    intercomProps.company = {
      company_id: currentUser.group.id,
      name: currentUser.group.name,
      // @ts-expect-error: Mateo will update forked Intercom type lib
      Slug: currentUser.group.slug,
      plan: currentUser.group.plan ? currentUser.group.plan.name : 'Trial',
    }
  } else {
    intercomProps.Marketplace = true
  }

  return intercomProps
}

type IntercomProps = {
  appId: string
}
const Intercom: VFC<IntercomProps> = ({ appId }) => {
  const { currentUser } = useCurrentUser()
  useIntercom(prepareIntercomProps(currentUser, appId))

  return null
}

export default Intercom
