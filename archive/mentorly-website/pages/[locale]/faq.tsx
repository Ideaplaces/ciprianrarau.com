import { gql } from '@apollo/client'
import TypedQuery from 'components/Graphql/TypedQuery'
import { H3 } from 'components/Headings'
import Input from 'components/Input'
import FaqCategoryContent from 'components/pages/Faq/FaqCategoryContent'
import FaqSearchResults from 'components/pages/Faq/FaqSearchResults'
import Panel from 'components/Panel'
import SEO from 'components/SEO/SEO'
import { connectServerSideProps } from 'lib/ssg'
import { ChangeEvent, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { Tab, TabList, Tabs } from 'react-tabs'
import {
  FaqCategories,
  FaqContentFieldsFragmentDoc,
  FaqPageQuery,
  FaqPageQueryVariables,
  useFaqPageQuery,
} from 'types/graphql'

gql`
  query faqPage($locale: String!, $search: String) {
    faqContents(locale: $locale, search: $search) {
      ...FaqContentFields
    }
    pageContent(id: "b2b.faq.intro") {
      title(locale: $locale)
      description(locale: $locale)
      body(locale: $locale, format: "html", headerOffset: 0)
    }
    faqCategories {
      general {
        id
        key
        question(locale: $locale)
        answer(locale: $locale, format: "html")
      }
      pricing {
        id
        key
        question(locale: $locale)
        answer(locale: $locale, format: "html")
      }
      payment {
        id
        key
        question(locale: $locale)
        answer(locale: $locale, format: "html")
      }
      security {
        id
        key
        question(locale: $locale)
        answer(locale: $locale, format: "html")
      }
    }
    ${FaqContentFieldsFragmentDoc}
  }
`

const FAQ = () => {
  const { locale } = useIntl()
  const [search, setSearch] = useState('')

  return (
    <TypedQuery<FaqPageQueryVariables>
      typedQuery={useFaqPageQuery}
      variables={{ locale, search }}
      runOnServer
    >
      {({ faqContents, pageContent, faqCategories }: FaqPageQuery) => {
        if (!pageContent) {
          return null
        }

        return (
          <>
            <SEO
              image={undefined}
              title="FAQ"
              description={pageContent?.title?.replace(/<(.|\n)*?>/g, '')}
            />
            <div
              className="pt-6 md:pt-12 pb-32 lg:py-32 xl:pb-64 bg-primary bg-cover bg-bottom"
              style={{ backgroundImage: 'url(/images/faq-leaves.png)' }}
            >
              <div className="w-2/3 lg:w-1/2 mx-auto text-center">
                <H3>{pageContent.title}</H3>
                <div
                  className="mb-12"
                  dangerouslySetInnerHTML={{
                    __html: pageContent.body as string,
                  }}
                />
                <Search value={search} onSearch={setSearch} />
              </div>
            </div>
            <Panel color="white" hasWave>
              <div className="container mx-auto min-h-faq flex">
                <div className="lg:w-3/5 lg:pr-16">
                  {search && <FaqSearchResults faqContents={faqContents} />}
                  {!search && faqCategories && (
                    <Tabulation faqCategories={faqCategories} />
                  )}
                </div>
                <div className="hidden lg:block lg:w-2/5 -mt-56 relative z-10 right-0">
                  <img src="/images/faq-girl.png" alt="" />
                </div>
              </div>
            </Panel>
          </>
        )
      }}
    </TypedQuery>
  )
}

type SearchProps = {
  value: string
  onSearch: (...args: any) => void
}

const Search: VFC<SearchProps> = ({ value, onSearch }) => {
  const [v, setV] = useState(value)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
    setV(e.target.value)
  }

  const onClear = () => {
    setV('')
    onSearch('')
  }

  // @TODO: this could be replaced with the Search component
  return (
    <div className="relative">
      <Input value={v} onChange={onChange} />
      {v && (
        <div className="absolute right-0 top-0 bottom-0">
          <button
            onClick={onClear}
            className="font-black text-2xl h-8 w-8 focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  )
}

const categories = ['general', 'pricing', 'payment', 'security'] as Array<
  keyof FaqCategories
>

type TabulationProps = {
  faqCategories: FaqCategories
}

const Tabulation: VFC<TabulationProps> = ({ faqCategories }) => {
  const intl = useIntl()
  return (
    <Tabs>
      <TabList className="flex flex-col sm:flex-row">
        {categories.map((category) => (
          <Tab
            key={category}
            className="text-xl md:text-2xl font-black cursor-pointer mr-10 mb-2 md:mb-0"
          >
            {intl.formatMessage({ id: `header.${category}` })}
          </Tab>
        ))}
      </TabList>
      {categories.map((category) => (
        <FaqCategoryContent
          key={category}
          category={category}
          faqCategories={faqCategories}
        />
      ))}
    </Tabs>
  )
}

export const getServerSideProps = connectServerSideProps(FAQ)
export default FAQ
