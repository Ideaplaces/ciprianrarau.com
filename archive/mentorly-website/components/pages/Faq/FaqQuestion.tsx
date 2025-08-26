import { gql } from '@apollo/client'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, VFC } from 'react'
import { FaqContentFieldsFragment } from 'types/graphql'

gql`
  fragment FaqContentFields on FaqContent {
    id
    key
    question(locale: $locale)
    answer(locale: $locale, format: "html")
  }
`

type FaqQuestionProps = {
  faq: FaqContentFieldsFragment
  open?: boolean
}
const FaqQuestion: VFC<FaqQuestionProps> = ({ faq, open }) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div key={faq.id} className="border-b-2 border-gray">
      <button
        className="font-black mb-6 cursor-pointer pt-6 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faq.question}
      </button>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`rich-text pb-8`}
            dangerouslySetInnerHTML={{ __html: faq.answer as string }}
          />
        </AnimatePresence>
      )}
    </div>
  )
}

export default FaqQuestion
