import { Form } from 'components/pages/Home/Form'
import { SEO } from 'components/SEO/SEO'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'

const RequestDemo = () => {
  const intl = useIntl()
  return (
    <>
      <SEO
        title={intl.locale === 'fr' ? 'Voir une démo' : 'Request a Demo'}
        description={undefined}
        image={undefined}
      />
      <Form color="yellow" hasWave />
    </>
  )
}

export const getServerSideProps = connectServerSideProps(RequestDemo)
export default RequestDemo
