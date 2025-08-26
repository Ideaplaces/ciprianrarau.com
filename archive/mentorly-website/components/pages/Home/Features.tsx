import { ButtonLink } from 'components/Button'
import { H2 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Panel } from 'components/Panel'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

const Tools: VFC = () => {
  const { locale, formatMessage } = useIntl()
  return (
    <Panel.Container className="ml:flex">
      <div>
        <Query id="b2b.home.tools">
          {({ pageContent }) => (
            <div className="ml:flex">
              <div className="relative z-10 ml:pr-10">
                <H2 className="text-center ml:text-left">
                  {pageContent.title}
                </H2>
                <div className="px-2 sm:px-10 md:px-30 mx-auto ml:px-0 ml:mx-0">
                  <div
                    className="mb-10 rich-text feature-list"
                    dangerouslySetInnerHTML={{ __html: pageContent.body }}
                  />
                </div>
              </div>
              <div className="hidden ml:block float-right mt-10 xl:mt-0 w-3/4 max-w-featureImage">
                <img alt="" src="/images/tools.png" />
              </div>
            </div>
          )}
        </Query>
        <div className="block ml:hidden mb-16 w-full md:w-4/6 mx-auto my-0">
          <img alt="" src="/images/tools.png" />
        </div>
        <Query id="b2b.home.cases">
          {({ pageContent }) => (
            <div className="z-10 ml:flex ml:mb-16 xl:mb-10 items-center">
              <div className="relative mr-14">
                <div className="hidden ml:block z-0 mt-24">
                  <img alt="" src="/images/desktop-PMI.png" />
                </div>
                <div className="hidden ml:block absolute w-2/5 xl:w-1/3 right-8 top-12">
                  <div>
                    <img alt="" src="/images/mobile-cmi.png" />
                  </div>
                </div>
                <div className="ml:block hidden mt-30 xl:mt-16 text-center">
                  <Link href={`/${locale}/blog/`} passHref>
                    <ButtonLink>
                      {formatMessage({ id: 'button.seeTheImpact' })}
                    </ButtonLink>
                  </Link>
                </div>
              </div>
              <div className="ml:w-3/4 pt-10">
                <H2 className="text-center ml:text-left">
                  {pageContent.title}
                </H2>
                <div className="px-2 sm:px-10 md:px-30 mx-auto ml:px-0 ml:mx-0">
                  <div
                    className="mb-10 rich-text feature-list"
                    dangerouslySetInnerHTML={{ __html: pageContent.body }}
                  />
                </div>
              </div>
            </div>
          )}
        </Query>
      </div>
      <div className="block ml:hidden mb-0 pt-10 mx-auto relative">
        <div className="absolute w-1/3 md:w-3/12 left-20 sm:left-32 top-6 md:left-48 ml:left-64 lg:left-72 sm:top-0">
          <img alt="" src="/images/mobile-cmi.png" />
        </div>
        <div className="z-10 w-full md:w-3/4 mx-auto my-0">
          <img alt="" src="/images/desktop-PMI.png" />
        </div>
        <div className="text-center mt-32">
          <Link href={`/${locale}/blog/`} passHref>
            <ButtonLink>
              {formatMessage({ id: 'button.seeTheImpact' })}
            </ButtonLink>
          </Link>
        </div>
      </div>
    </Panel.Container>
  )
}

export const Features: VFC = () => {
  return (
    <Panel color="teal" className="pt-24 text-white overflow-hidden">
      <Tools />
    </Panel>
  )
}
