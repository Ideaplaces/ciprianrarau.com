import { gql } from '@apollo/client'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { FeaturesFieldsFragment, Maybe } from 'types/graphql'

gql`
  fragment FeaturesFields on FeatureContent {
    id
    name(locale: $locale)
    planStart
    planTeams
    planPro
    planEnterprise
  }
`

type FeaturesListProps = {
  features: FeaturesFieldsFragment[]
}
const FeaturesList: VFC<FeaturesListProps> = ({ features }) => {
  return (
    <>
      {features.map((feature) => (
        <Row
          key={feature.id}
          desc={feature.name}
          checks={[
            feature.planStart,
            feature.planTeams,
            feature.planPro,
            feature.planEnterprise,
          ]}
        />
      ))}
    </>
  )
}

type RowProps = {
  desc?: Maybe<string>
  checks?: Maybe<string | undefined>[]
}

const Row: VFC<RowProps> = ({ desc, checks }) => {
  return (
    <div
      className={`even:bg-white bg-gray py-4 flex flex-col md:flex-row items-center text-xs md:text-base container mx-auto`}
    >
      {desc && (
        <div className="flex items-center px-6 w-full md:w-1/3 text-base">
          {desc}
        </div>
      )}
      <div className="w-2/3 mt-4 md:mt-0 self-end flex">
        {checks?.map((check, i) => (
          <div key={i} className="flex justify-center items-center w-full pr-1">
            <Check value={check} />
          </div>
        ))}
      </div>
    </div>
  )
}

type CheckProps = {
  value?: Maybe<string>
}

const Check: VFC<CheckProps> = ({ value }) => {
  const { formatMessage } = useIntl()

  if (!value) {
    return null
  }

  return <span>{formatMessage({ id: `feature.${value}` })}</span>
}

export default FeaturesList
