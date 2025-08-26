import classNames from 'classnames'
import { FC } from 'react'
import { ChevronRight, Edit2 } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  DisciplineFieldsFragment,
  SubdisciplineFieldsFragment,
} from 'types/graphql'

type ItemType = DisciplineFieldsFragment | SubdisciplineFieldsFragment

type ItemProps = {
  item: ItemType
  handleSelect?: (id: string) => void
  handleUpdate: (item: ItemType) => void
  selected?: ItemType
}
const Item: FC<ItemProps> = ({
  item,
  handleSelect,
  handleUpdate,
  selected,
}) => {
  const { formatMessage } = useIntl()

  const isSelected = handleSelect && item?.id === selected?.id

  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-x-2 p-2',
        handleSelect && item?.id === selected?.id && 'bg-gray'
      )}
    >
      <button
        className="flex flex-start items-center space-x-1"
        onClick={() => handleUpdate(item)}
      >
        <Edit2 className="mr-1" size={14} />
        <div>{item.name}</div>
      </button>
      <div className="flex ml-3">
        {handleSelect && (
          <button
            className={classNames(
              'ml-4 flex items-center text-darkerGray',
              isSelected && '-mr-9 pl-9'
            )}
            onClick={() => handleSelect(item.id)}
          >
            {!isSelected && (
              <>
                <span>{formatMessage({ id: 'form.expand' })}</span>
                <ChevronRight size={18} className="text-darkerGray" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default Item
