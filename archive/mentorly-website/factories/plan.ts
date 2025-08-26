import { Factory } from 'fishery'
import { Plan } from 'types/graphql'

export const planFactory = Factory.define<Plan>(({ sequence }) => {
  return {
    id: sequence.toString(),
    name: 'Start',
  }
})
