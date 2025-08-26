import classNames from 'classnames'
import DashboardLayout from 'components/Dashboard/Layout'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { H3 } from 'components/Headings'
import Panel from 'components/Panel'
import featuresByGroup, { FeatureConfigKey } from 'config/features'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { isBoolean, isFunction, isNumber, startCase } from 'lodash'
import { useState, VFC } from 'react'
import { ChevronRight } from 'react-feather'
import { useIntl } from 'react-intl'

const Index = () => {
  const { currentUser, loading } = useCurrentUser()
  const { push } = useRouter()
  const { locale } = useIntl()

  const featureNames = Object.keys(
    featuresByGroup['default']
  ) as FeatureConfigKey[]
  const groupNames = Object.keys(featuresByGroup)

  groupNames.forEach((group) => {
    featureNames.forEach((feature) => {
      if (!(feature in featuresByGroup[group])) {
        featuresByGroup[group][feature] = featuresByGroup['default'][feature]
      }
    })
  })

  const groupsByFeature = {} as Record<string, any>
  featureNames.forEach((featureName) => {
    groupsByFeature[featureName] = {}
    groupNames.forEach((group) => {
      groupsByFeature[featureName][group] = featuresByGroup[group][featureName]
    })
  })

  const [cluster, setCluster] = useState({
    name: 'group',
    data: featuresByGroup,
  })

  const toggleCluster = () => {
    if (cluster.name === 'feature')
      setCluster({ name: 'group', data: featuresByGroup })
    if (cluster.name === 'group')
      setCluster({ name: 'feature', data: groupsByFeature })
  }

  if (loading) return <Spinner />

  if (!currentUser) {
    push(`/${locale}/login`)
  }

  if (!currentUser?.mentorlyAdmin) {
    push('/404')
  }

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <H3>Feature Flags</H3>
        <button
          onClick={toggleCluster}
          className="px-3 py-1 bg-gray hover:bg-mediumGray w-40 rounded border border-darkGray mb-5"
        >
          Group by {cluster.name === 'group' ? 'feature' : 'slug'}
        </button>
      </div>
      <Alert showIcon className="mb-3 max-w-4xl">
        This page lists the features activated for each client. It is visible
        only by Mentorly staff members. For any questions about these options,
        or to make changes, please contact the dev team{' '}
        <span role="img" aria-label="developer">
          🧑‍💻
        </span>
      </Alert>

      {Object.keys(cluster.data).map((name) => (
        <Row name={name} values={cluster.data[name]} key={name} />
      ))}
    </Panel>
  )
}

type RowProps = {
  name: string
  values: Record<string, any>
}

const Row: VFC<RowProps> = ({ name, values }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <div className="flex items-center" onClick={() => setExpanded(!expanded)}>
        <ChevronRight
          color="#ccc"
          size={20}
          className={classNames('transition duration-200 transform mr-1', {
            'rotate-90': expanded,
          })}
        />
        <div className="font-bold hover:opacity-75 cursor-pointer my-1">
          {startCase(name)}
        </div>
      </div>
      {expanded && (
        <div>
          {Object.keys(values).map((k) => (
            <div
              className="flex items-center justify-between w-[400px] pl-4 border-b py-1 border-mediumGray"
              key={k}
            >
              <div className="flex-grow grow min-w-75 min-w-[240px]">
                {startCase(k)}
              </div>
              <FeatureValue value={values[k]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type FeatureValueProps = {
  value: any
}
const FeatureValue: VFC<FeatureValueProps> = ({ value }) => {
  return (
    <div
      className={classNames({
        'bg-green bg-opacity-50': value,
        'bg-red bg-opacity-25': !value,
        'border border-darkGray py-0 px-2 rounded-full text-sm':
          !isFunction(value),
        'text-xs left-96 p-1 rounded ml-10 bg-blue': isFunction(value),
        'bg-blue font-black': isNumber(value),
      })}
    >
      {isFunction(value) || isNumber(value) ? (
        <pre>{value.toString()}</pre>
      ) : isBoolean(value) ? (
        value ? (
          'On'
        ) : (
          'Off'
        )
      ) : (
        ''
      )}
    </div>
  )
}

Index.Layout = DashboardLayout

export const getServerSideProps = connectServerSideProps(Index)
export default Index
