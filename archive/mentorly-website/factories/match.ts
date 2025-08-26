import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import {
  Group,
  ManagedGroup,
  ManagedUser,
  MentorMatch,
  MentorMatchStatusEnum,
} from 'types/graphql'

import { userFactory } from './user'

type MentorMatchTransientParams = {
  user?: ManagedUser
  group?: ManagedGroup | Group
}

export const matchFactory = Factory.define<
  MentorMatch,
  MentorMatchTransientParams
>(({ transientParams, sequence }) => {
  const isMentor = faker.datatype.boolean()
  return {
    matchedAt: new Date(),
    activatedAt: new Date(),
    active: faker.datatype.boolean(),
    id: sequence.toString(),
    manual: faker.datatype.boolean(),
    mentee:
      !isMentor && transientParams.user
        ? transientParams.user
        : (userFactory.build({
            mentor: false,
            group: transientParams.group as Group,
          }) as unknown as ManagedUser),
    mentor:
      isMentor && transientParams.user
        ? transientParams.user
        : (userFactory.build({
            mentor: true,
            group: transientParams.group as Group,
          }) as unknown as ManagedUser),
    responses: [
      {
        id: faker.datatype.uuid(),
        matchingResponse: ['response1'],
        menteeResponse: ['response1', 'response2'],
        mentorResponse: ['response1', 'response3'],
        question: {
          id: faker.datatype.uuid(),
          answers: ['response1', 'response2', 'response3', 'response4'],
          instructions: 'please provide an answer',
          key: faker.datatype.uuid(),
          position: 1,
          profile: false,
          question: 'what is your favourite response?',
          questionType: 'personal?',
          required: false,
        },
      },
    ],
    staged: false,
    score: faker.datatype.number(100),
    scorePercentage: faker.datatype.number(100),
    status: MentorMatchStatusEnum.Activated,
  }
})
