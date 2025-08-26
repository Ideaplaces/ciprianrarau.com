import Button from 'components/Button'
import TagFormPopup from 'components/Dashboard/Members/TagForm'
import Modal from 'components/Modal'
import Search from 'components/Search/Search'
import { Dispatch, FC, SetStateAction } from 'react'
import { Plus } from 'react-feather'
import { useIntl } from 'react-intl'

type SearchAndAddProps = {
  query: string | undefined
  setQuery: (props?: any) => void
  showModal: boolean
  refetch: any
  setShowModal: Dispatch<SetStateAction<boolean>>
}

const SearchAndAdd: FC<SearchAndAddProps> = ({
  query,
  setQuery,
  showModal,
  refetch,
  setShowModal,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-1 items-center space-x-1">
        <Search onChange={setQuery} onSearch={setQuery} searchTerm={query} />
      </div>
      <div className="flex ml-4 space-x-4">
        <Button
          className="flex items-center cursor-pointer space-x-2"
          onClick={() => setShowModal(true)}
        >
          <Plus />
          <span>{formatMessage({ id: 'tagging.createTag' })}</span>
        </Button>
        <Modal open={showModal} close={() => setShowModal(false)} width="sm">
          <TagFormPopup
            refetch={refetch}
            closeModal={() => setShowModal(false)}
          />
        </Modal>
      </div>
    </div>
  )
}

export default SearchAndAdd
