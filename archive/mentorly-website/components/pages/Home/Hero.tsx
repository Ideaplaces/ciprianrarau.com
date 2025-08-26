import { RequestDemo } from 'components/Forms/RequestDemo/'
import { SignUpButton } from 'components/Forms/SignUp/SignUpLink'
import { H2 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Panel } from 'components/Panel'
import { VFC } from 'react'

export const Hero: VFC = () => {
  const forbesInterviewURL =
    'https://www.forbes.com/sites/pauleannareid/2021/01/25/mentorship-matters-why-these-founders-saw-a-457-spike-in-growth-during-the-pandemic/?sh=633fcd6e165b'
  return (
    <Query id="b2b.home.intro">
      {({ pageContent }) => (
        <Panel color="yellow" className="overflow-hidden -mt-48 pt-48 md:pt-64">
          <Panel.Container className="md:flex">
            <div className="w-full sm:mb-0 absolute right-0 bottom-0 z-0">
              <img
                src="/images/form-flowers-no-circle.png"
                className="absolute bottom-0 right-0"
                alt=""
              />
            </div>
            <div className="relative mt-12 md:mt-0 sm:mb-16 md:mb-6 lg:pt-6 xl:mb-16 z-10 md:pr-6">
              <H2>{pageContent.title}</H2>
              <div
                className="mb-10 lg:w-2/3 text-lg"
                dangerouslySetInnerHTML={{ __html: pageContent.body }}
              />
              <div className="flex gap-4">
                <RequestDemo formId="request-demo" className="py-3 text-xl" />
                <SignUpButton className="py-3 text-xl" />
              </div>
            </div>
            <div className="relative w-3/4 z-10 hidden md:block md:w-8/12 md:min-w-mediumMasthead ml:w-1/2 lg:w-full lg:min-w-masthead xl:w-4/6">
              <a href={forbesInterviewURL}>
                <div className="absolute top-0 right-2 w-1/4 h-1/4" />
              </a>
              <img src="/images/masthead.png" alt="" width={600} />
            </div>
            <div className="relative block z-10 md:hidden mt-16">
              <a href={forbesInterviewURL}>
                <div className="absolute bottom-0 right-6 w-2/5 h-2/6" />
              </a>
              <img src="/images/mobile-masthead.png" alt="" width={600} />
            </div>
          </Panel.Container>
        </Panel>
      )}
    </Query>
  )
}
