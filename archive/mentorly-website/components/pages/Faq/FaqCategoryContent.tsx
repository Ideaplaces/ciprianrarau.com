import FaqQuestion from 'components/pages/Faq/FaqQuestion'
import { AnimatePresence, motion } from 'lib/framer-motion'
import { VFC } from 'react'
import { TabPanel } from 'react-tabs'
import { FaqCategories, FaqContent } from 'types/graphql'

type FaqCategoriesContentProps = {
  faqCategories?: FaqCategories
  category: keyof FaqCategories
}

const FaqCategoryContent: VFC<FaqCategoriesContentProps> = ({
  faqCategories,
  category,
}) => {
  if (!faqCategories) {
    console.error('no categories')
    return null
  }
  const faqContent = faqCategories[
    category as keyof FaqCategories
  ] as FaqContent[]

  return (
    <TabPanel key={category}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mt-8">
            {faqContent?.map((faq) => (
              <FaqQuestion key={faq.id} faq={faq} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </TabPanel>
  )
}

export default FaqCategoryContent
