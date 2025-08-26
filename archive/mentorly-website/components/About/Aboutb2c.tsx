import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { connectStaticPaths, connectStaticProps } from 'lib/ssg'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'

import TeamContent from './TeamContent'

const Aboutb2c = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="wrapper mx-auto">
      <Head>
        <title>{formatMessage({ id: 'menu.about' })}</title>
      </Head>
      <Panel color="white">
        <Panel.Container>
          <PageContent
            id="b2c.about.intro"
            titleSize="h3"
            titlePosition="left"
          />
          <TeamContent />
          <PageContent
            id="b2c.about.contact"
            titleSize="h3"
            titlePosition="left"
          />
        </Panel.Container>
      </Panel>
    </div>
  )
}

export const getStaticPaths = connectStaticPaths('about')
export const getStaticProps = connectStaticProps(Aboutb2c)

export default Aboutb2c
