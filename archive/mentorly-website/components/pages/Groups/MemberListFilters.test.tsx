import '@testing-library/jest-dom'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { memberUrl } from 'lib/urls'
import { currentGroup } from 'mocks'
import TestWrapper from 'mocks/TestWrapper'
import mockRouter from 'next-router-mock'
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes'
import singletonRouter from 'next/router'

import MemberListFilters from './MemberListFilters'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next/dist/client/router', () => require('next-router-mock'))
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = require('react')
  const router = require('next-router-mock').default
  const RouterContext = createContext(router)
  return { RouterContext }
})

mockRouter.useParser(
  createDynamicRouteParser([`/en${memberUrl(currentGroup)}/`, '/en'])
)

xdescribe('MemberListFilters component', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(`/`)
  })
  test('returns search but not filters if frontPage', async () => {
    render(
      <TestWrapper withoutCurrentUser>
        <MemberListFilters
          frontPage={true}
          query={undefined}
          setQuery={undefined}
        />
      </TestWrapper>
    )
    await waitFor(() => {
      const memberSearch = screen.getByTestId('member-search')
      expect(memberSearch).toBeInTheDocument()
      const memberFilters = screen.queryByTestId('member-filters')
      expect(memberFilters).not.toBeInTheDocument()
      const browseBtn = screen.getByTestId('browse-btn')
      expect(browseBtn).toBeInTheDocument()
      fireEvent.click(browseBtn)
      expect(singletonRouter).toMatchObject({
        asPath: `/en${memberUrl(currentGroup)}`,
      })
      // @TODO: these tests should be done at the component level for Search
      const searchInput = screen.getByTestId('search-input')
      expect(searchInput).toBeInTheDocument()
      searchInput.focus()
      expect(searchInput).toHaveFocus()
      fireEvent.change(searchInput, { target: { value: 'test' } })
      expect(searchInput).toHaveValue('test')
      const searchButton = screen.getByTestId('search-button')
      fireEvent.click(searchButton)
      expect(singletonRouter).toMatchObject({
        asPath: `/en${memberUrl(currentGroup)}?query=test`,
      })
    })
  })
  test('returns search and filters if not frontPage', async () => {
    render(
      <TestWrapper withoutCurrentUser>
        <MemberListFilters
          frontPage={false}
          query={undefined}
          setQuery={undefined}
        />
      </TestWrapper>
    )
    await waitFor(() => {
      const memberSearch = screen.queryByTestId('member-search')
      expect(memberSearch).toBeInTheDocument()
      const memberFilters = screen.queryByTestId('member-filters')
      expect(memberFilters).toBeInTheDocument()
      // @TODO: test for filter behaviour should be done at the component level
    })
  })
})
