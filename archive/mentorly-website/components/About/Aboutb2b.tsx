import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { connectStaticPaths, connectStaticProps } from 'lib/ssg'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'

import TeamContent from './TeamContent'

const Aboutb2b = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="wrapper mx-auto">
      <Head>
        <title>{formatMessage({ id: 'menu.about' })}</title>
      </Head>
      <Panel color="white">
        <Panel.Container>
          <PageContent
            id="b2b.about.intro"
            titleSize="h3"
            titlePosition="left"
          />
          <TeamContent />
          <PageContent
            id="b2b.about.contact"
            titlePosition="left"
            titleSize="h3"
          />
        </Panel.Container>
      </Panel>
    </div>
  )
}

export const getStaticPaths = connectStaticPaths('about')
export const getStaticProps = connectStaticProps(Aboutb2b)

export default Aboutb2b
