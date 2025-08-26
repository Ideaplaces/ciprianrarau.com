import DashboardLayout from 'components/Dashboard/Layout'
import HelpPageLayout, { CProps } from 'components/HelpPage'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

const Index = () => {
  //TODO: type currentGroup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentGroup }: any = useCurrentGroup()
  const { formatMessage } = useIntl()
  const [collectionList, setCollectionList] = useState<CProps[]>([])

  useEffect(() => {
    let collections: CProps[] = []

    if (!currentGroup?.marketplace) {
      collections = [
        {
          href: 'https://help.mentorly.co/en/collections/807636-program-member',
          title: formatMessage({ id: 'header.programMembers' }),
          subtitle: formatMessage({ id: 'text.resources.members' }),
          type: 'member',
        },
      ]
    }

    if (
      currentGroup &&
      (currentGroup.slug === 'sxsw' || currentGroup.slug === 'sxswedu')
    ) {
      collections.push({
        href: 'https://help.mentorly.co/en/collections/2708530-sxsw-sxsw-edu-online-2021',
        title: 'SXSW & SXSW EDU Online 2021',
        subtitle: 'Resources for participants',
      })
    }
    setCollectionList(collections)
  }, [])

  return <HelpPageLayout collectionList={collectionList} />
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
