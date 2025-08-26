import gql from 'graphql-tag'
import { CalendarLinksFieldsFragmentDoc } from 'types/graphql'

// @TODO: userFields should be replaced and the various uses of updateUser...etc should be added to components
// use colocated fragments instead

// @TODO: currentFullUserQuery should not be used
// remove the <User> component in graphql folder and instead rely on colocated fragments as well

gql`
  fragment userFields on ManagedUser {
    id
    ...ManagedGroupAvatarsFields
    archivedAt
    allowGroupSessions
    availabilities {
      id
      allowGroupSessions
      endTime
      startTime
      location {
        id
        address
      }
    }
    email
    contactEmail
    phoneNumber
    extensionNumber
    externalId
    externalUserUrl
    status
    rate30
    rate60
    cancellationPolicy
    calendarUrl
    calendarProvider
    pastBookings: bookings(segment: "past") {
      id
      mentee {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      mentor {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      groupSession
      startTime
    }
    futureBookings: bookings(segment: "future") {
      id
      mentee {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      mentor {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      groupSession
      startTime
    }
    files {
      fileUrl
      id
      imageUrl(width: 100, height: 80)
      mimeType
      type
    }
    discipline {
      id
      name
    }
    disciplines {
      id
      name
    }
    subdisciplines {
      id
      name
    }
    skills
    experience
    pronouns
    role
    skills
    softSkills
    hardSkills
    shortTermGoals
    longTermGoals
    website
    socialLinks {
      type
      url
    }
    peopleNetwork
    description
    welcomeMessage
    group {
      id
    }
    slug
    name
    mentor
    cohort {
      id
      name
    }
    tags {
      id
      name
    }
    status
    avatar {
      id
      imageUrl(height: 64, width: 64)
      color
      initials
    }
    location
    languages {
      id
      code
      name
    }
    preferredLanguage {
      id
      code
      name
    }
    matches(limit: 18) {
      id
      active
      mentee {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      mentor {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
      }
      manual
      score
    }
    mentorMatches(limit: 18) {
      id
      active
      mentee {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
        disciplines {
          id
          name
        }
      }
      mentor {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
        disciplines {
          id
          name
        }
      }
      manual
      scorePercentage
    }
    menteeMatches(limit: 18) {
      id
      active
      mentee {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
        disciplines {
          id
          name
        }
        slug
      }
      mentor {
        id
        mentor
        name
        avatar {
          ...AvatarFields
        }
        disciplines {
          id
          name
        }
        slug
      }
      manual
      score
    }
    approvedMentor
    featuredMentor
    onboarded
    company
    behanceLink
    dribbbleLink
    facebookLink
    linkedinLink
    twitterLink
    vimeoLink
    youtubeLink
    instagramLink
    profileImageUrl(height: 80, width: 80)
  }
`

gql`
  mutation createUser($groupId: ID!, $attributes: UserAttributes!) {
    createUser(groupId: $groupId, attributes: $attributes) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

gql`
  mutation updateUser($id: ID!, $attributes: UserAttributes!) {
    updateUser(id: $id, attributes: $attributes) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

gql`
  mutation archiveUser($id: ID!) {
    archiveUser(id: $id) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

gql`
  mutation unarchiveUser($id: ID!) {
    unarchiveUser(id: $id) {
      user {
        ...userFields
      }
      errors
      errorDetails
    }
  }
`

gql`
  mutation resetPassword(
    $token: ID!
    $email: String!
    $password: String!
    $groupId: ID
  ) {
    resetPassword(
      token: $token
      email: $email
      password: $password
      groupId: $groupId
    ) {
      user {
        id
        token
      }
      errors
      errorDetails
    }
  }
`

gql`
  query validateResetPasswordToken($token: ID!, $email: String!, $groupId: ID) {
    validateResetPasswordToken(token: $token, email: $email, groupId: $groupId)
  }
`

gql`
  mutation deleteConnection($type: SocialConnection!) {
    deleteConnection(type: $type) {
      errorDetails
    }
  }
`

gql`
  query currentFullUser {
    disciplines {
      id
      name
      subdisciplines {
        id
        name
      }
    }
    viewer {
      id
      accounts {
        id
        name
        slug
        groups {
          id
          name
          slug
        }
      }
      avatar {
        id
        color
        initials
        imageUrl(height: 80, width: 80)
      }
      bookings {
        id
        startTime
        endTime
        calendarLinks {
          ...CalendarLinksFields
        }
        mentor {
          id
        }
      }
      calendarId
      calendarProvider
      calendarUrl
      availabilityCalendarId
      contactEmail
      company
      description
      onboardingPercent
      profilePercent
      discipline {
        id
        name
        slug
      }
      disciplines {
        id
        name
      }
      email
      experience
      files {
        id
        imageUrl(height: 128, width: 192)
        mimeType
        fileUrl
        type
      }
      group {
        id
        name
        slug
        disciplines {
          id
          name
          subdisciplines {
            id
            name
          }
        }
        files {
          id
          imageUrl(height: 128, width: 192)
          mimeType
          fileUrl
          type
        }
      }
      managedGroups {
        id
      }
      intercomHash
      languages {
        id
        code
        name
      }
      location
      name
      mentor
      rates
      cancellationPolicy
      phoneNumber
      preferredLanguage {
        id
        code
        name
      }
      profileImageUrl(height: 160, width: 160)
      pronouns
      role
      subdisciplines {
        id
        name
        slug
      }
      availabilityCalendarId
      calendarId
      timezone
      skills
      hardSkills
      softSkills
      shortTermGoals
      longTermGoals
      slug
      surveyResult {
        id
        data
      }
      userRole
      website
      welcomeMessage
      socialLinks {
        type
        url
      }
      behanceLink
      dribbbleLink
      facebookLink
      instagramLink
      linkedinLink
      twitterLink
      vimeoLink
      youtubeLink
    }
  }
  ${CalendarLinksFieldsFragmentDoc}
`
