import { gql } from '@apollo/client'
import classNames from 'classnames'
import Alert from 'components/feedback/Alert'
import { H1, H2, H3 } from 'components/Headings'
import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { usePageContentQuery } from 'types/graphql'

gql`
  query pageContent($id: ID!, $locale: String!, $headerOffset: Int = 1) {
    pageContent(id: $id) {
      title(locale: $locale)
      description(locale: $locale)
      body(locale: $locale, format: "html", headerOffset: $headerOffset)
    }
  }
`

type TitleSizeType = 'h1' | 'h2' | 'h3'

type PageContentProps = {
  id: string
  contentStyle?: string
  titlePosition: 'right' | 'left' | 'center'
  titleSize: TitleSizeType
}
const PageContent: FC<PageContentProps> = ({
  id,
  contentStyle,
  titleSize,
  titlePosition,
}) => {
  const { locale } = useIntl()
  const { loading, error, data } = usePageContentQuery({
    variables: { id, locale, headerOffset: 0 },
  })

  if (loading || !data) {
    return null
  }

  if (error) {
    return (
      <Alert title="Error" description={error?.message} type="error" showIcon />
    )
  }

  if (!data.pageContent) {
    return (
      <Alert showIcon type="warning">
        Content for <code>{id}</code> missing
      </Alert>
    )
  }
  const { pageContent } = data

  return (
    <div>
      <div
        className={classNames('my-8', {
          'flex justify-start': titlePosition === 'left',
          'flex justify-center': titlePosition === 'center',
          'flex justify-end': titlePosition === 'right',
        })}
      >
        <PageTitle titleSize={titleSize}>{pageContent.title}</PageTitle>
      </div>
      <div
        className={classNames('rich-text page-content', contentStyle)}
        dangerouslySetInnerHTML={{ __html: pageContent.body as string }}
      />
    </div>
  )
}

type PageTitleProps = {
  children: ReactNode
  titleSize: TitleSizeType
}

const PageTitle: FC<PageTitleProps> = ({ children, titleSize }) => {
  switch (titleSize) {
    case 'h1':
      return <H1>{children}</H1>
    case 'h2':
      return <H2>{children}</H2>
    case 'h3':
      return <H3>{children}</H3>
    default:
      return null
  }
}

export default PageContent
