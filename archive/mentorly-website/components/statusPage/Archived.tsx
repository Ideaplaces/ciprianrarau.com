import type { LogoSelectGroup } from 'components/general/LogoSelect'
import { useIntl } from 'react-intl'
import { usePageContentQuery } from 'types/graphql'

import StatusPage from './StatusPage'

const ArchivedError = ({ group }: { group: LogoSelectGroup }) => {
  const { locale } = useIntl()
  const { loading, data } = usePageContentQuery({
    variables: { id: 'b2b.archived_group', locale, headerOffset: 0 },
  })

  if (loading) {
    return <div>Loading</div>
  }

  if (!data?.pageContent) {
    return <div>Not found</div>
  }

  const { pageContent } = data

  return (
    <StatusPage group={group} title={pageContent.title || 'Archived'}>
      <div
        className={'rich-text page-content'}
        dangerouslySetInnerHTML={{ __html: pageContent.body as string }}
      />
    </StatusPage>
  )
}

export default ArchivedError
