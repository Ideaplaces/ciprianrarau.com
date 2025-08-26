import { useCurrentGroup } from 'lib/GroupContext'
import { get, isFunction } from 'lodash'
import { FC, ReactNode } from 'react'
import { Maybe } from 'types/graphql'

import mainConfig, {
  FeatureConfigType,
  FlagDefinitionType,
  FlagResultType,
} from '../config/features'

type ContextType = Record<string, any>
type FeatureProps = {
  id: string
  children?: ReactNode
  group?: any
  context?: ContextType
}

export type FeatureGroupType = {
  slug: string
}

export type FindFeatureFlagProps = {
  group: FeatureGroupType
  id: string
  config?: FeatureConfigType
}

export const findFeatureFlag = (
  group: Maybe<FindFeatureFlagProps['group']> | undefined,
  id: FindFeatureFlagProps['id'],
  config?: FindFeatureFlagProps['config']
): FlagDefinitionType => {
  const defaultConfig: FlagDefinitionType = get(config, ['default', id], false)

  if (group) {
    return get(config, [group.slug, id], defaultConfig)
  } else {
    return defaultConfig
  }
}

export const getFeatureFlag = (
  group: Maybe<FeatureGroupType> | undefined,
  id: string,
  context?: ContextType,
  config?: FeatureConfigType
): FlagResultType => {
  const result = findFeatureFlag(group, id, config || mainConfig)

  if (isFunction(result)) {
    return result(context)
  } else {
    return result
  }
}

export const useFeatureFlag = (id: string, context?: ContextType) => {
  const { currentGroup, loading }: any = useCurrentGroup()

  if (loading) {
    return false
  }

  return getFeatureFlag(currentGroup, id, context)
}

const Feature: FC<FeatureProps> = ({ id, group, children, context }): any => {
  const { currentGroup, loading } = useCurrentGroup()

  if (loading) {
    return null
  }

  const active = getFeatureFlag(currentGroup || group, id, context)

  if (active) {
    return children
  } else {
    return null
  }
}

export default Feature
