import { gql } from '@apollo/client'
import { CaseStudy, Eyebrow, Hero } from 'components/pages/CaseStudies'
import { Form } from 'components/pages/Home/Form'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { connectServerSideProps } from 'lib/ssg'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, useUseCaseContentsQuery } from 'types/graphql'

gql`
  query useCaseContents($locale: String!) {
    useCaseCategories {
      communities {
        ...UseCaseFields
      }
      schools {
        ...UseCaseFields
      }
      networks {
        ...UseCaseFields
      }
      specialProgramming {
        ...UseCaseFields
      }
    }
    useCaseContents {
      ...UseCaseFields
    }
  }

  fragment UseCaseFields on UseCaseContent {
    id
    name(locale: $locale)
    organization(locale: $locale)
    body(locale: $locale, format: "html")
    quote {
      id
      name(locale: $locale)
      body(locale: $locale, format: "html")
    }
    videoUrl(locale: $locale)
  }
`

type UseCase = {
  id: string
  name?: Maybe<string>
  organization?: Maybe<string>
  body?: Maybe<string>
  videoUrl?: Maybe<string>
  quote?: Maybe<{
    body?: Maybe<string>
    name?: Maybe<string>
  }>
}

type CommunitiesType = {
  useCases?: Maybe<UseCase[]>
}
const Communities: FC<CommunitiesType> = ({ useCases }) => {
  if (!useCases) {
    return null
  }

  return (
    <Panel color="white" hasWave>
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="md:w-2/3 lg:w-1/2">
          {useCases[0]?.name && (
            <Eyebrow number={1} title={useCases[0]?.name} />
          )}
          {useCases.map((useCase) => (
            <CaseStudy
              key={useCase.id}
              client={useCase.organization}
              description={useCase.body}
              quote={useCase.quote && useCase.quote.body}
              person={(useCase.quote && useCase.quote.name) || 'Mentorly user'}
              videoUrl={useCase.videoUrl}
            />
          ))}
        </div>
        <div className="w-full lg:w-1/2 mt-16 lg:ml-16">
          <img
            src={`/images/cases/startup-canada.png`}
            className="max-h-panel"
            alt=""
          />
        </div>
      </div>
    </Panel>
  )
}

type SchoolsProps = {
  useCases?: Maybe<UseCase[]>
}
const Schools: FC<SchoolsProps> = ({ useCases }) => {
  if (!useCases) {
    return null
  }

  return (
    <Panel color="yellow" hasWave>
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="w-1/2 mb-6 lg:w-1/2 mt-16 lg:mr-16">
          <img src={`/images/cases/02.png`} className="max-h-panel" alt="" />
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 xl:w-1/4">
          <img src={`/images/cases/02-bg.png`} className="w-full" alt="" />
        </div>
        <div className="md:w-2/3 lg:w-1/2">
          {useCases[0]?.name && (
            <Eyebrow number={2} title={useCases[0]?.name} />
          )}
          {useCases.map((useCase) => (
            <CaseStudy
              key={useCase.id}
              client={useCase.organization}
              description={useCase.body}
              quote={useCase.quote && useCase.quote.body}
              person={(useCase.quote && useCase.quote.name) || 'Mentorly user'}
              videoUrl={useCase.videoUrl}
            />
          ))}
        </div>
      </div>
    </Panel>
  )
}

type NetworksProps = {
  useCases?: Maybe<UseCase[]>
}
const Networks: FC<NetworksProps> = ({ useCases }) => {
  if (!useCases) {
    return null
  }

  return (
    <Panel color="white" hasWave>
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="md:w-2/3 lg:w-1/2">
          {useCases[0]?.name && (
            <Eyebrow number={3} title={useCases[0]?.name} />
          )}
          {useCases.map((useCase) => (
            <CaseStudy
              key={useCase.id}
              client={useCase.organization}
              description={useCase.body}
              quote={useCase.quote && useCase.quote.body}
              person={(useCase.quote && useCase.quote.name) || 'Mentorly user'}
              quoteMarkColor="white"
              videoUrl={useCase.videoUrl}
            />
          ))}
        </div>
        <div className="w-full md:w-1/2 md:mx-auto lg:w-1/2 mt-16 lg:ml-16">
          <img
            src={`/images/cases/mentor-grid.png`}
            className="max-h-panel"
            alt=""
          />
        </div>
      </div>
    </Panel>
  )
}

type SchoolProgrammingProps = {
  useCases?: Maybe<UseCase[]>
}
const SpecialProgramming: FC<SchoolProgrammingProps> = ({ useCases }) => {
  if (!useCases) {
    return null
  }

  return (
    <Panel color="white">
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="absolute bottom-0 left-0 right-0">
          <img className="w-full" src="/images/blue-wave.png" alt="" />
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/2 mt-16 lg:mr-16 hidden lg:block">
          <img
            src={`/images/cases/04.png`}
            className="max-h-panel relative -mb-64"
            alt=""
          />
        </div>
        <div className="md:w-2/3 lg:w-1/2">
          {useCases[0]?.name && (
            <Eyebrow number={4} title={useCases[0]?.name} />
          )}
          {useCases.map((useCase) => (
            <CaseStudy
              key={useCase.id}
              client={useCase.organization}
              description={useCase.body}
              quote={useCase.quote && useCase.quote.body}
              person={(useCase.quote && useCase.quote.name) || 'Mentorly user'}
              videoUrl={useCase.videoUrl}
            />
          ))}
        </div>
      </div>
    </Panel>
  )
}

const UseCaseContent = () => {
  const intl = useIntl()
  const { loading, error, data } = useUseCaseContentsQuery({
    variables: { locale: intl.locale },
  })

  if (loading) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  const { useCaseCategories } = data || {}

  return (
    <div>
      <Communities useCases={useCaseCategories?.communities} />
      <Schools useCases={useCaseCategories?.schools} />
      <Networks useCases={useCaseCategories?.networks} />
      <SpecialProgramming useCases={useCaseCategories?.specialProgramming} />
    </div>
  )
}

const CaseStudies = () => {
  const intl = useIntl()

  return (
    <>
      <SEO
        title={intl.formatMessage({ id: 'menu.caseStudies' })}
        description={undefined}
        image={undefined}
      />
      <Hero />
      <UseCaseContent />
      <Form
        color="purple"
        hasWave
        className="bg-cover bg-top pb-48"
        style={{ backgroundImage: `url(/images/form-flowers-crop.png)` }}
      />
    </>
  )
}

export const getServerSideProps = connectServerSideProps(CaseStudies)
export default CaseStudies
