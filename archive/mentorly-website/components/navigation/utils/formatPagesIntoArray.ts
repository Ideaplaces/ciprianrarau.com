export type Page = {
  selected?: boolean
  threeDots?: boolean
  pageNumber: number
}

const formatPagesIntoArray = (currentPage = 1, totalPages: number): Page[] => {
  // first one
  const pages: Page[] = [
    {
      selected: currentPage == 1,
      pageNumber: 1,
    },
  ]

  // first three dots
  if (currentPage > 3) {
    pages.push({
      threeDots: true,
      pageNumber: currentPage - 2,
    })
  }

  // everything in between
  if (totalPages > 2) {
    if (currentPage > 2) {
      pages.push({
        selected: false,
        pageNumber: currentPage - 1,
      })
    }

    if (currentPage > 1 && currentPage < totalPages) {
      pages.push({
        selected: true,
        pageNumber: currentPage,
      })
    }

    if (currentPage + 1 < totalPages) {
      pages.push({
        selected: false,
        pageNumber: currentPage + 1,
      })
    }
  }

  // last three dots
  if (totalPages > 3 && currentPage < totalPages - 2) {
    pages.push({
      threeDots: true,
      pageNumber: currentPage + 2,
    })
  }

  // last one
  if (totalPages > 1) {
    pages.push({
      selected: currentPage === totalPages,
      pageNumber: totalPages,
    })
  }

  return pages
}

export default formatPagesIntoArray
