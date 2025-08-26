import { VFC } from 'react'

import StatusPage from './StatusPage'

const Maintenance: VFC = () => {
  return (
    <StatusPage title={'Maintenance'}>
      Mentorly is undergoing database maintenance and will be back shortly.
    </StatusPage>
  )
}

export default Maintenance
