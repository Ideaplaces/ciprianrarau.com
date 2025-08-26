import { useQuery } from '@apollo/client'
import FormatDateTime from 'components/general/DateTime'
import Panel from 'components/Panel'
import { connectServerSideProps } from 'lib/ssg'
import Head from 'next/head'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { graphql } from 'src/gql'

const blogPostsQueryDocument = graphql(/* GraphQL */ `
  query blogPostsQuery {
    blogContents {
      id
      categories
      description
      key
      publishedAt
      title
    }
  }
`)

const BlogPost = ({ blogPost }: any) => {
  return (
    <div className="space-y-4">
      <Link href={`/en/blog/${blogPost.key}`}>
        <a className="hover:underline">
          <h2 className="text-4xl font-black leading-10">{blogPost.title}</h2>
        </a>
      </Link>
      <p
        className="rich-text"
        dangerouslySetInnerHTML={{ __html: blogPost.description }}
      />
      <div className="text-sm my-2 py-2">
        <div>
          Published{' '}
          <FormatDateTime date={blogPost.publishedAt} format="date.fullDate" />
        </div>
        <div>Categorized as {blogPost.categories.join(', ')}</div>
      </div>
    </div>
  )
}

const Blog = () => {
  const { formatMessage } = useIntl()
  const { data } = useQuery(blogPostsQueryDocument)

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'menu.blog' })}</title>
      </Head>
      <Panel>
        <Panel.Container>
          <div className="space-y-16 max-w-md mt-8">
            {data?.blogContents?.map((blogPost) => (
              <BlogPost key={blogPost.id} blogPost={blogPost} />
            ))}
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getServerSideProps = connectServerSideProps(Blog)
export default Blog
