import { H2 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Panel } from 'components/Panel'
import { VFC } from 'react'

export const Stats: VFC = () => {
  return (
    <Query id="b2b.home.stats">
      {({ pageContent }) => (
        <Panel color="yellow" hasWave className="pt-16">
          <Panel.Container>
            <div className="z-0 absolute bottom-0 right-0 w-full md:w-3/4 lg:w-1/2">
              <img src="/images/form-leaves.png" alt="" />
            </div>
            <div className="w-full hidden ml:block xl:hidden">
              <H2>{pageContent.title}</H2>
            </div>
            <div className="ml:flex justify-between text-center ml:text-left">
              <div className="ml:flex-1 ml:mr-16 z-10">
                <H2 className="block ml:hidden xl:block">
                  {pageContent.title}
                </H2>
                <div
                  className="mb-10 rich-text stats"
                  dangerouslySetInnerHTML={{ __html: pageContent.body }}
                />
              </div>
              <div className="relative sm:w-full ml:w-7/12 lg:w-1/2 lg:min-w-stats xl:w-5/12 mt-16 z-10">
                <img
                  src="/images/stats.png"
                  className="max-h-panel z-10"
                  alt=""
                />
              </div>
            </div>
          </Panel.Container>
        </Panel>
      )}
    </Query>
  )
}
