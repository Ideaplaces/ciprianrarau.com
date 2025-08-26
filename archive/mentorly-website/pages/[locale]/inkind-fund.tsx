import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'

const Inkind = () => {
  const { currentGroup, loading } = useCurrentGroup()
  const { formatMessage } = useIntl()

  if (
    (!currentGroup && !loading) ||
    (currentGroup && currentGroup.slug !== 'marketplace')
  ) {
    return (
      <h1 className="text-center my-64 text-5xl font-black">
        {formatMessage({ id: 'header.pageNotFound' })}
      </h1>
    )
  }

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'text.inKindTitle' })}</title>
      </Head>
      <Panel color="white">
        <Panel.Container>
          <PageContent
            titlePosition="left"
            id="b2c.inkind.intro"
            contentStyle="text-xl m-10 pl-5 border-l-4 border-blue text-justify font-semibold"
            titleSize="h2"
          />
          <PageContent
            titlePosition="left"
            titleSize="h2"
            id="b2c.inkind.text"
          />
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getServerSideProps = connectServerSideProps(Inkind)
export default Inkind
