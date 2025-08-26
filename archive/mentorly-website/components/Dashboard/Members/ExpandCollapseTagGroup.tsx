import classNames from 'classnames'
import { Dispatch, FC, SetStateAction } from 'react'
import { ChevronsDown, ChevronsUp } from 'react-feather'
import { useIntl } from 'react-intl'

type ExpandCollapseProps = {
  expand: boolean
  setExpandAll: Dispatch<SetStateAction<boolean>>
  expandAll: boolean
}

const ExpandCollapse: FC<ExpandCollapseProps> = ({
  expand,
  setExpandAll,
  expandAll,
}) => {
  const { formatMessage } = useIntl()
  const disabled = expandAll === expand

  return (
    <button
      className={classNames('flex items-center space-x-2 text-highlightColor', {
        'opacity-50 cursor-default': disabled,
      })}
      onClick={() => setExpandAll(expand)}
      disabled={disabled}
    >
      <p>
        {formatMessage({
          id: `form.${expand ? 'expand' : 'collapse'}All`,
        })}
      </p>
      <span className="rounded-full bg-black p-1 text-white">
        {expand ? <ChevronsDown size={14} /> : <ChevronsUp size={14} />}
      </span>
    </button>
  )
}

export default ExpandCollapse
