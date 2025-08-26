import { H2 } from 'components/Headings'
import { Panel } from 'components/Panel'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'

const RequestDemo = () => {
  const intl = useIntl()

  return (
    <Panel color="yellow">
      <div className="text-center my-12">
        <H2>{intl.formatMessage({ id: 'form.requestDemo.success.header' })}</H2>
        <div className="text-xl mb-4 w-3/4 mx-auto">
          {intl.formatMessage({ id: 'form.requestDemo.success.body' })}
        </div>
        <iframe
          className="meetings-iframe-container"
          style={{ height: '800px', width: '100%' }}
          src="https://meetings.hubspot.com/ashley349?uuid=f661a8cb-3fdd-4a95-8617-2ee95157172a"
          title={intl.formatMessage({ id: 'form.requestDemo.success.header' })}
        ></iframe>
      </div>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(RequestDemo)
export default RequestDemo
