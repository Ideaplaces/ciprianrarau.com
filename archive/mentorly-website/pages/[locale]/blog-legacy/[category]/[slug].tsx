import { useQuery } from '@apollo/client'
import FormatDateTime from 'components/general/DateTime'
import Panel from 'components/Panel'
import { connectServerSideProps } from 'lib/ssg'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { graphql } from 'src/gql'

const blogPostQueryDocument = graphql(/* GraphQL */ `
  query blogPostQuery($id: ID!) {
    blogContent(id: $id) {
      id
      bodyHtml
      categories
      key
      publishedAt
      title
    }
  }
`)

const BlogPost = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const query = router?.query || {}

  const id = query.category ? `${query.category}/${query.slug}` : ''

  const { data, error } = useQuery(blogPostQueryDocument, {
    skip: !query.category,
    variables: { id },
  })

  if (error) {
    return <div>An error occured</div>
  }

  if (!data?.blogContent) {
    return <div>...</div>
  }

  const blogPost = data?.blogContent

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'menu.blog' })}</title>
      </Head>
      <Panel>
        <Panel.Container>
          <div className="max-w-md space-y-4 mt-8">
            <Link href={`/en/blog/${blogPost.key}`}>
              <a>
                <h1 className="text-4xl font-black">{blogPost.title}</h1>
              </a>
            </Link>
            {blogPost.bodyHtml && (
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: blogPost.bodyHtml }}
              />
            )}
            <div className="border-t-2 text-sm border-black my-2 py-2">
              <div>
                Published{' '}
                <FormatDateTime
                  date={blogPost.publishedAt}
                  format="date.fullDate"
                />
              </div>
              <div>Categorized as {blogPost.categories.join(', ')}</div>
            </div>
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getServerSideProps = connectServerSideProps(BlogPost)
export default BlogPost
