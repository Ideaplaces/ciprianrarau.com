import { Meta, Story } from '@storybook/react'
import { groupFactory } from 'factories/group'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  CurrentUserDocument,
  GroupEssentialsDocument,
  RegisterUserDocument,
} from 'types/graphql'

import SignUpForm, { SignUpFormProps } from './SignUp'

export default {
  title: 'Navigation/SignUpForm',
  component: SignUpForm,
  argTypes: {},
} as Meta

const Template: Story<SignUpFormProps & { groupId: string }> = ({
  groupId,
  ...args
}) => (
  <UserProvider>
    <GroupProvider groupId={groupId} hasServerSideProps={true}>
      <SignUpForm {...args} />
    </GroupProvider>
  </UserProvider>
)

const mockCurrentUser = {
  request: {
    query: CurrentUserDocument,
    variables: {},
  },
  result: {
    data: {
      viewer: null,
    },
  },
}

const mockCurrentGroupFull = {
  request: {
    query: GroupEssentialsDocument,
    variables: { id: '2', locale: 'en' },
  },
  result: {
    data: {
      group: {
        ...groupFactory.build(),
        id: '2',
        memberCount: 200,
        plan: {
          userLimit: 1,
        },
        errors: [],
        errorDetails: undefined,
        loginUrl: undefined,
      },
    },
  },
}

const mockCurrentGroup = {
  request: {
    query: GroupEssentialsDocument,
    variables: { id: '1', locale: 'en' },
  },
  result: {
    data: {
      group: {
        ...groupFactory.build(),
        id: '1',
        memberCount: 1,
        plan: {
          userLimit: 200,
        },
        errors: [],
        errorDetails: undefined,
        loginUrl: undefined,
      },
    },
  },
}

const mockRegisterUserMutation = {
  request: {
    query: RegisterUserDocument,
    variables: {
      groupId: '1',
      mentor: false,
      name: 'Test User',
      email: 'test@test.com',
      password: 'test@test.com',
    },
  },
  result: {
    data: {
      registerUser: {
        user: {
          id: '1',
          group: {
            id: '1',
          },
          token: 'token',
          email: 'test@test.com',
          mentor: false,
          name: 'Test User',
        },
        errors: [],
        errorDetails: undefined,
        loginUrl: undefined,
      },
    },
  },
}

export const Completed = Template.bind({})
Completed.args = { groupId: '1' }
// Completed.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   // const userTypes = canvas.getAllByTestId('mentor')
//   // const [menteeType, mentorType] = userTypes
//   const button = await canvas.findByTestId('primary')
//   await userEvent.type(canvas.getByTestId('name'), 'Test User')
//   await userEvent.type(canvas.getByTestId('email'), 'test@test.com')
//   await userEvent.type(canvas.getByTestId('password'), 'test@test.com')
//   // @TODO: should the rest of this be in a test file?
//   await userEvent.click(button)
//   const body = within(canvasElement.parentElement!)
//   const modal = await body.findByTestId('modal')
//   await expect(modal).toHaveTextContent('Sign-up successful!')
//   const close = body.getByTestId('close-modal')
//   await userEvent.click(close)
//   // refill form after DOM re-write
//   await userEvent.type(canvas.getByTestId('name'), 'Test User')
//   await userEvent.type(canvas.getByTestId('email'), 'test@test.com')
//   await userEvent.type(canvas.getByTestId('password'), 'test@test.com')
// }
Completed.parameters = {
  apolloClient: {
    mocks: [
      mockCurrentUser,
      mockCurrentUser,
      mockCurrentGroup,
      mockCurrentGroup,
      mockRegisterUserMutation,
      mockRegisterUserMutation,
    ],
  },
}

export const ProgramFull = Template.bind({})
ProgramFull.args = { groupId: '2' }
// ProgramFull.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const alert = await canvas.findByText(
//     'This program has reached the maximum number of users. Please contact your program manager for more information.'
//   )
//   await expect(alert).toBeInTheDocument()
// }
ProgramFull.parameters = {
  apolloClient: {
    mocks: [mockCurrentUser, mockCurrentGroupFull],
  },
}

export const Empty = Template.bind({})
Empty.args = { groupId: '1' }
Empty.parameters = {
  apolloClient: {
    mocks: [mockCurrentUser, mockCurrentGroup],
  },
}

export const Invalid = Template.bind({})
Invalid.args = { groupId: '1' }
// Invalid.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   // const userTypes = canvas.getAllByTestId('mentor')
//   // const [menteeType, mentorType] = userTypes
//   const button = await canvas.findByTestId('primary')
//   await userEvent.click(button)
//   const fields = await canvas.findAllByTestId('field-error')
//   fields.forEach(
//     async (f) => await expect(f).toHaveTextContent('is a required field')
//   )
// }
Invalid.parameters = {
  apolloClient: {
    mocks: [mockCurrentUser, mockCurrentGroup],
  },
}
