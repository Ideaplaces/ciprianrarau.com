import RequestDemoForm from 'components/Forms/RequestDemo/RequestDemoForm'
import { H2 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Panel } from 'components/Panel'

export const Form = ({ ...props }) => {
  return (
    <Query id="b2b.home.form">
      {({ pageContent }) => (
        <Panel className="pt-16" {...props}>
          <div className="container relative text-center md:text-left mx-auto md:flex justify-between z-10 bg-bottom mt-6 md:mt-20">
            <div className="md:hidden block">
              <img alt="" src="/images/drone.png" className="max-h-panel" />
            </div>
            <div className="md:w-5/12 ">
              <H2>{pageContent.title}</H2>
              <div
                className="mb-10 md:mb-0 lg:mb-10"
                dangerouslySetInnerHTML={{ __html: pageContent.body }}
              />
              <div className="hidden lg:hidden md:block w-3/4">
                <img alt="" src="/images/drone.png" className="max-h-panel" />
              </div>
            </div>
            <div className="hidden absolute lg:block md:left-64 lg:-top-40 lg:w-2/5 xl:w-1/3 xl:left-96 mr-1/12">
              <img alt="" src="/images/drone.png" className="max-h-panel" />
            </div>
            <div className="md:w-5/12 md:pl-12 self-center">
              <RequestDemoForm id="request-demo" onHomepage />
            </div>
          </div>
        </Panel>
      )}
    </Query>
  )
}
