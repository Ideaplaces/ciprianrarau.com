import { RequestDemo } from 'components/Forms/RequestDemo/'
import { H2 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Panel } from 'components/Panel'
import { Video } from 'components/Video'
import React, { VFC } from 'react'

export const VideoPanel: VFC = () => {
  return (
    <Query id="b2b.home.benefits">
      {({ pageContent }) => (
        <Panel color="white" className="pt-16">
          <Panel.Container>
            <div>
              <H2 className="text-center pt-20">{pageContent.title}</H2>
              <div className="my-16">
                <Video />
              </div>
            </div>
            <div className="text-center">
              <RequestDemo
                formId="request-demo"
                className="py-3 text-xl mx-auto"
              />
            </div>
          </Panel.Container>
        </Panel>
      )}
    </Query>
  )
}
