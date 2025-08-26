import Link from 'next/link'
import React from 'react'

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextUrl: string | null
  prevUrl: string | null
  baseUrl?: string
  className?: string
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  nextUrl,
  prevUrl,
  baseUrl = '/blog',
  className = '',
}) => {
  if (totalPages <= 1) {
    return null
  }

  const generatePageUrl = (page: number): string => {
    if (page === 1) {
      return baseUrl
    }
    return `${baseUrl}/page/${page}`
  }

  const renderPageNumbers = () => {
    const pages = []
    const showPages = 5 // Show 5 page numbers at most
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Link key={1} href={generatePageUrl(1)}>
          <a className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            1
          </a>
        </Link>
      )
      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis1"
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            ...
          </span>
        )
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link key={i} href={generatePageUrl(i)}>
          <a
            className={`px-3 py-2 text-sm font-medium border ${
              i === currentPage
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}
          >
            {i}
          </a>
        </Link>
      )
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis2"
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            ...
          </span>
        )
      }
      pages.push(
        <Link key={totalPages} href={generatePageUrl(totalPages)}>
          <a className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {totalPages}
          </a>
        </Link>
      )
    }

    return pages
  }

  return (
    <div className={`flex items-center justify-center mt-12 ${className}`}>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {/* Previous button */}
        {hasPrev && prevUrl ? (
          <Link href={prevUrl}>
            <a className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Link>
        ) : (
          <span className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-300 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-600">
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next button */}
        {hasNext && nextUrl ? (
          <Link href={nextUrl}>
            <a className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Link>
        ) : (
          <span className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-300 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-600">
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </nav>
    </div>
  )
}

export default BlogPagination
