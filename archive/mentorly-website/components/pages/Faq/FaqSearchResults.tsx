import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { FaqContentFieldsFragment } from 'types/graphql'

import FaqQuestion from './FaqQuestion'

type FaqSearchResultsType = {
  faqContents: FaqContentFieldsFragment[]
}
const FaqSearchResults: VFC<FaqSearchResultsType> = ({ faqContents }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="-mt-16">
      {faqContents.length > 0 ? (
        faqContents.map((faq) => <FaqQuestion key={faq.id} faq={faq} open />)
      ) : (
        <div className="mt-8">
          {formatMessage(
            { id: 'faq.noResults' },
            { link: 'mailto:support@mentorly.co' }
          )}
        </div>
      )}
    </div>
  )
}

export default FaqSearchResults
