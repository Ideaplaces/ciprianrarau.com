import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const Terms = () => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  const scope = currentGroup?.marketplace ? 'b2c' : 'b2b'

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'menu.terms' })}</title>
      </Head>
      <Panel>
        <Panel.Container>
          <PageContent
            id={`${scope}.terms_of_use`}
            titleSize="h3"
            titlePosition="left"
          />
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getServerSideProps = connectServerSideProps(Terms)
export default Terms
