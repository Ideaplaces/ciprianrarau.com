import { useCurrentGroup } from 'lib/GroupContext'
import React, { VFC } from 'react'
import { useIntl } from 'react-intl'
import { MasterclassDetailsFieldsFragment } from 'types/graphql'

import MasterclassDetails from './MasterclassDetails'

type MasterclassListProps = {
  masterclasses: MasterclassDetailsFieldsFragment[]
}

const MasterclassList: VFC<MasterclassListProps> = ({ masterclasses }) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  if (!currentGroup.allowMasterclasses) {
    return null
  }

  if (!masterclasses) {
    return null
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-extrabold my-8">
        {formatMessage({ id: 'header.upcomingMasterclasses' })}:
      </h2>
      <div className="mb-10 space-y-10">
        {masterclasses.length < 1 ? (
          <em className="opacity-50">
            {formatMessage({ id: 'text.noUpcomingMasterclasses' })}
          </em>
        ) : (
          masterclasses.map((masterclass, i) => (
            <React.Fragment key={i}>
              {i > 0 && <hr className="border-darkGray" />}
              <MasterclassDetails masterclass={masterclass} />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  )
}

export default MasterclassList
