import { gql } from '@apollo/client'
import classNames from 'classnames'
import { ButtonLink } from 'components/Button/Button'
import MemberCard from 'components/display/MemberCard'
import { SignUpButton } from 'components/Forms/SignUp/SignUpLink'
import { H2, H4 } from 'components/Headings'
import Query from 'components/PageContent/Query'
import { Testimonials } from 'components/pages/Home/Testimonials'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import Slider from 'components/Slider'
import { Video } from 'components/Video'
import { Wave } from 'components/Wave/Wave'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  MemberCardFieldsFragment,
  MemberCardFieldsFragmentDoc,
  useGroupSearchMentorsQuery,
} from 'types/graphql'

gql`
  query groupSearchMentors(
    $disciplineId: ID
    $experience: String
    $groupId: ID!
    $query: String
    $subdisciplineId: ID
    $frontPage: Boolean
    $page: Int
    $limit: Int
    $locale: String!
    $tagKeys: [String!]
  ) {
    group(id: $groupId) {
      id
      mentorCount(
        disciplineId: $disciplineId
        experience: $experience
        subdisciplineId: $subdisciplineId
        tagKeys: $tagKeys
        query: $query
      )
      mentors(
        frontPage: $frontPage
        page: $page
        limit: $limit
        query: $query
        disciplineId: $disciplineId
        experience: $experience
        subdisciplineId: $subdisciplineId
        tagKeys: $tagKeys
      ) {
        ...MemberCardFields
      }
    }
  }
  ${MemberCardFieldsFragmentDoc}
`

const Marketplace = () => (
  <div className="overflow-hidden w-full h-full">
    <SEO title="Marketplace" image="images/01.png" />
    <Hero />
    <HowItWorks />
    <FindAMentor />
    <Testimonials
      className="-mt-10 -mb-10 items-center"
      color="white"
      highlight="green"
      hideTitle
      category="b2c"
    />
    <InKind />
    <KickStart />
  </div>
)

const Hero = () => {
  return (
    <Query id="b2c.home.hero">
      {({ pageContent }) => (
        <Panel color="yellow" className="-mt-40 pt-48 md:pt-56 pb-16 md:pb-32">
          <Panel.Container className="relative">
            <div
              className={classNames(
                'relative z-10',
                'mb-10',
                'sm:mb-20',
                'md:mb-0',
                'lg:mb-6 lg:w-2/4',
                'xl:mb-16'
              )}
            >
              <H2>{pageContent.title}</H2>
              <div
                className="mb-16 w-10/12 sm:w-1/2"
                dangerouslySetInnerHTML={{ __html: pageContent.body }}
              />
              <SignUpButton />
            </div>
            <div
              className={classNames(
                'max-w-3xl absolute right-0 bottom-0 z-10',
                'w-8/12 -mb-16',
                'sm:w-4/6 sm:-mr-6 sm:-mb-20',
                'md:w-7/12 md:-mb-36 md:-mr-12',
                'lg:w-2/3 lg:-mb-40',
                'xl:w-8/12 xl:-mb-48'
              )}
            >
              <img
                src="/images/b2c_home_masthead.png"
                className="absolute bottom-0 right-0"
                alt=""
              />
            </div>
          </Panel.Container>
          <Wave color="white" />
        </Panel>
      )}
    </Query>
  )
}

const HowItWorks = () => {
  const { formatMessage, locale } = useIntl()
  return (
    <Query id="b2c.home.how_it_works">
      {({ pageContent }) => (
        <Panel
          color="white"
          className="overflow-hidden pt-16 md:pt-32 pb-16 md:pb-32"
        >
          <Panel.Container>
            <H2>{pageContent.title}</H2>
            <div
              className="mb-10 w-full"
              dangerouslySetInnerHTML={{ __html: pageContent.body }}
            />
            <Video category="b2c" />
          </Panel.Container>
          <Panel.Container className="my-6 flex flex-col sm:flex-row align-center sm:space-x-6 mb-16">
            <HowPanels />
          </Panel.Container>
          <Link href={`${locale}/pricing`} passHref>
            <ButtonLink className="mx-auto">
              {formatMessage({ id: 'button.learnMore' })}
            </ButtonLink>
          </Link>
          <Wave color="white" />
        </Panel>
      )}
    </Query>
  )
}

const HowPanels: VFC = () => (
  <>
    {['browse', 'book', 'connect'].map((type, i) => {
      return (
        <Query id={`b2c.home.how_it_works.${type}`} key={i}>
          {({ pageContent }) => (
            <div
              className={classNames(
                'w-full mx-auto items-center',
                'flex space-y-8',
                'sm:flex-col sm:space-y-4',
                i === 1 && 'flex-row-reverse'
              )}
            >
              <img
                className="w-full hidden sm:block"
                src={`/images/b2c_home_how_0${i + 1}.png`}
                alt=""
              />
              <img
                className="w-5/12 block sm:hidden"
                src={`/images/b2c_home_how_0${i + 1}_icon.png`}
                alt=""
              />
              <span
                className={classNames(
                  'w-full sm:ml-0 sm:py-4 pr-4',
                  i === 1 ? 'ml-0 mr-4' : 'ml-10 mr-0'
                )}
              >
                <H4 className="font-bold whitespace-nowrap">
                  {i + 1}. {pageContent.title}
                </H4>
                <div
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: pageContent.body }}
                />
              </span>
            </div>
          )}
        </Query>
      )
    })}
  </>
)

const FindAMentor = () => {
  const { locale, formatMessage } = useIntl()
  const { loading, error, data } = useGroupSearchMentorsQuery({
    variables: {
      groupId: 'marketplace',
      limit: 6,
      locale,
      frontPage: true,
    },
  })

  if (loading || error) return null

  const sliderSettings = {
    universal: {
      breakpoint: { max: 9999, min: 0 },
      items: 1,
      partialVisibilityGutter: 40,
    },
  }

  return (
    <Query id="b2c.home.find_mentor">
      {({ pageContent }) => (
        <Panel
          color="lightGreen"
          className="overflow-hidden pt-16 md:pt-32 pb-24 md:pb-32 wrap "
        >
          <div className="container mx-auto relative">
            <div>
              <H2>{pageContent.title}</H2>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: pageContent.body }}
              />
            </div>
            <div className="block md:hidden justify-center my-16 nowrap">
              <Slider
                itemClass="p-3 justify-center items-center w-screen"
                dotListClass="mt-10 relative flex"
                settings={sliderSettings}
                autoPlay
                centerMode
                autoPlaySpeed={2000}
                swipeable
                draggable
                showDots
                arrows={false}
                renderDotsOutside
              >
                {data?.group?.mentors.map(
                  (mentor: MemberCardFieldsFragment) => (
                    <MemberCard key={mentor.id} user={mentor} hideBadge />
                  )
                )}
              </Slider>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-x-4 gap-y-8 my-16">
              {data?.group?.mentors.map((mentor: MemberCardFieldsFragment) => (
                <MemberCard key={mentor.id} user={mentor} hideBadge />
              ))}
            </div>
          </div>
          <Link href={`${locale}/mentors/`} passHref>
            <ButtonLink className="mx-auto my-6">
              {formatMessage({ id: 'button.browseMentors' })}
            </ButtonLink>
          </Link>
          <Wave color="white" flipX />
        </Panel>
      )}
    </Query>
  )
}

const InKind = () => {
  const { formatMessage, locale } = useIntl()
  return (
    <Query id="b2c.home.inkind">
      {({ pageContent }) => (
        <Panel color="lightBlue" className="pt-16 md:pt-32 pb-24 md:pb-32">
          <Panel.Container className="relative">
            <div
              className={classNames(
                'max-w-lg absolute right-0 bottom-0 z-10',
                'w-5/12 -mb-32 transform -scale-x-100',
                'sm:w-3/6 sm:-mr-6 sm:-mb-32',
                'md:scale-x-100 md:left-0 md:w-6/12 md:-mb-36 md:-mr-12',
                'lg:w-4/12 lg:ml-4 lg:-mb-22',
                'xl:ml-28'
              )}
            >
              <img
                src="/images/b2c_home_fund.png"
                className="absolute bottom-0 right-0"
                alt=""
              />
            </div>
            <div
              className={classNames(
                'relative mr-auto z-10',
                'w-full mb-10',
                'sm:w-6/12 sm:mb-0',
                'md:w-5/12 md:mb-0 md:ml-auto md:mr-0',
                'lg:w-7/12 lg:mb-6',
                'xl:w-1/2 xl:mb-16'
              )}
            >
              <H2>{pageContent.title}</H2>
              <div
                className="mb-10 w-7/12 sm:w-full"
                dangerouslySetInnerHTML={{ __html: pageContent.body }}
              />
              <Link href={`${locale}/inkind-fund`} passHref>
                <ButtonLink>
                  {formatMessage({ id: 'button.applyNow' })}
                </ButtonLink>
              </Link>
            </div>
          </Panel.Container>
          <Wave color="white" />
        </Panel>
      )}
    </Query>
  )
}

const KickStart = () => {
  return (
    <Query id="b2c.home.kickstart">
      {({ pageContent }) => (
        <Panel
          color="white"
          className="mt-32 mb-12 overflow-hidden justify-center"
        >
          <Panel.Container className="justify-center text-center">
            <H2>{pageContent.title}</H2>
            <div
              className="mb-10 w-full text-center"
              dangerouslySetInnerHTML={{ __html: pageContent.body }}
            />
          </Panel.Container>
          <SignUpButton className="text-center" />
        </Panel>
      )}
    </Query>
  )
}

export default Marketplace
