import { grey, yellow } from 'components/Dashboard/Reporting/constants'
import PiePlot from 'components/Dashboard/Reporting/Plots/PiePlot'
import Panel from 'components/display/Panel'
import { VFC } from 'react'

// const completionRatePlaceholder = [
//   {
//     grouping: '4/4',
//     mentees: ['Elaine Chan', 'David Willis', 'Isaiah Bunch', 'Jennifer Marl'],
//   },
//   { grouping: '3/4', mentees: ['Jane Berry', 'Moe Kerr', 'Malcom Xi'] },
//   { grouping: '2/4', mentees: ['Jane Berry', 'Moe Kerr', 'Malcom Xi'] },
//   { grouping: '1/4', mentees: ['Jane Berry', 'Moe Kerr', 'Malcom Xi'] },
// ]

// let row = []
// completionRatePlaceholder.map((group) => {
//   for(let i=0; i<completionRatePlaceholder.mentees; i++) {
//     {mentees.push(completionRatePlaceholder.mentee[i]? completionRatePlaceholder.mentee[i] : null )
//   }
// })

type CompletionRateProps = {
  testCohorts: Array<{
    id: string
    complete: boolean
    inProgress: boolean
  }>
}

const CompletionRate: VFC<CompletionRateProps> = ({ testCohorts }) => {
  return (
    <div className="relative">
      <Panel>
        <div className="flex">
          {testCohorts.map((cohort, i) => {
            return (
              <div key={`completion-${i}`} className="flex-col flex-grow">
                <div>{`Cohort ${cohort.id}`}</div>
                <PiePlot
                  className="h-48"
                  data={[
                    { name: 'Complete', value: cohort.complete },
                    {
                      name: 'In progress',
                      value: cohort.inProgress,
                    },
                  ]}
                  value="value"
                  name="name"
                  colors={[yellow, grey]}
                />
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}

CompletionRate.propTypes = {}

CompletionRate.defaultProps = {}

export default CompletionRate
