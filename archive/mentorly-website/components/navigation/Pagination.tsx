import classNames from 'classnames'
import { VFC } from 'react'
import {
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
  Icon,
} from 'react-feather'

import formatPagesIntoArray from './utils/formatPagesIntoArray'

export type PageProps = {
  className?: string
  page?: number
  per?: number
  setPage: (number: number) => void
  total?: number
}

type PageButtonProps = {
  pageNumber: number
  selected?: boolean
  threeDots?: boolean
  onClick: (number: number) => void
}

type NavButtonProps = {
  testId?: string
  icon: Icon
  disabled: boolean
  onClick: () => void
}

const NavButton: VFC<NavButtonProps> = ({
  testId,
  icon,
  disabled,
  onClick,
}) => {
  const Icon = icon
  return (
    <button
      className={classNames(
        'h-8 w-8 flex justify-center items-center rounded-full bg-white',
        {
          'cursor-default': disabled,
        }
      )}
      data-testid={testId || icon}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <Icon size={16} className={disabled ? 'opacity-50' : 'opacity-100'} />
    </button>
  )
}

const PageButton: VFC<PageButtonProps> = ({
  pageNumber,
  selected,
  threeDots,
  onClick,
}) => {
  const handleClick = () => {
    onClick(pageNumber)
  }

  return (
    <button
      className={classNames(
        'h-8 min-w-8 px-2 flex justify-center items-center rounded-full',
        {
          'bg-black text-white cursor-default': selected,
          'bg-white': !selected,
        }
      )}
      data-testid={`page-${pageNumber}-button`}
      onClick={handleClick}
      type="button"
      disabled={selected}
    >
      {threeDots ? <>&hellip;</> : pageNumber}
    </button>
  )
}

const Pagination: VFC<PageProps> = ({
  className,
  page = 1,
  per = 10,
  setPage,
  total,
}) => {
  if (total === 0) {
    return null
  }

  if (!total) {
    console.error('pagination needs total')
    return null
  }

  const totalPages = Math.ceil(total / per)
  const formattedPages = formatPagesIntoArray(page, totalPages)

  return (
    <div
      data-testid="pagination"
      className={classNames(
        'flex justify-center p-4 space-x-2 text-sm text-black leading-none',
        className
      )}
    >
      <>
        <NavButton
          testId="left-nav-button"
          disabled={page < 2}
          icon={LeftIcon}
          onClick={() => setPage(page - 1)}
        />
        {formattedPages.map((props) => (
          <PageButton {...props} key={props.pageNumber} onClick={setPage} />
        ))}
        <NavButton
          testId="right-nav-button"
          disabled={page >= totalPages}
          icon={RightIcon}
          onClick={() => setPage(page + 1)}
        />
      </>
    </div>
  )
}

export default Pagination
