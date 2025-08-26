import { FeatureGroupType, getFeatureFlag } from 'components/Feature'
import { Maybe } from 'types/graphql'

export const allowSignUpGroupUser = (group?: Maybe<FeatureGroupType>) => {
  if (!group) {
    return true
  }

  return getFeatureFlag(group, 'signUp')
}
