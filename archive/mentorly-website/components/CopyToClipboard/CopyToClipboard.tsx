import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link as LinkIcon } from 'react-feather'
import { useIntl } from 'react-intl'

type CopyToClipboardProps = {
  string: string
  size?: string | number
  children?: ReactNode
  tooltipText?: string
  className?: string
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  string,
  size,
  children,
  tooltipText,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const { formatMessage } = useIntl()

  const handleClick = (e: any) => {
    //todo: execComand is deprecated. Should be changed to navigator.clipboard.writeText()
    const tempElement = document.createElement('textarea')
    const target = e.target.insertAdjacentElement('afterend', tempElement)
    tempElement.value = string
    tempElement.select()
    document.execCommand('copy')
    target.parentNode.removeChild(tempElement)
    setIsCopied(true)
  }

  useEffect(() => {
    document.addEventListener('copy', () => {
      if (isCopied) {
        setIsCopied(false)
      }
    })
  }, [isCopied])

  const text = () => {
    if (isCopied) return formatMessage({ id: 'tooltip.copied' })
    if (tooltipText) return tooltipText
    return formatMessage({ id: 'tooltip.copyToClipboard' })
  }

  return (
    <Tooltip text={text()}>
      <div
        onClick={handleClick}
        className={classNames(
          'flex items-center space-x-2 cursor-pointer',
          isCopied && 'opacity-25',
          className
        )}
        style={{ transition: '0.15s opacity' }}
      >
        <LinkIcon
          size={size}
          className="transition duration-200 ease-in-out opacity-75 hover:opacity-100"
        />
        {children}
      </div>
    </Tooltip>
  )
}

export default CopyToClipboard
