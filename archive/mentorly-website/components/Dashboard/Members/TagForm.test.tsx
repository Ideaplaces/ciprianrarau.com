import '@testing-library/jest-dom'

import { RefetchQueriesFunction } from '@apollo/client'
import { render, screen, waitFor } from '@testing-library/react'
import { currentGroupFactory } from 'factories/group'
import { tagFactory } from 'factories/tag'
import TestWrapper from 'mocks/TestWrapper'

import TagForm from './TagForm'

jest.mock('next/router', () => require('next-router-mock'))

const enOnly = [{ id: 'en', code: 'en', name: 'en' }]
const frOnly = [{ id: 'fr', code: 'fr', name: 'fr' }]
const bilingual = [...enOnly, ...frOnly]

const tagFormParams = {
  tag: tagFactory.build(),
  closeModal: () => null,
  refetch: (() => null) as unknown as RefetchQueriesFunction,
}
const filteringTag = {
  ...tagFormParams,
  tag: tagFactory.build({ isFiltering: true, isPublic: false }),
}
const publicTag = {
  ...tagFormParams,
  tag: tagFactory.build({ isFiltering: false, isPublic: true }),
}
const publicAndFilteringTag = {
  ...tagFormParams,
  tag: tagFactory.build({ isFiltering: true, isPublic: true }),
}
const neitherPublicNorFilteringTag = {
  ...tagFormParams,
  tag: tagFactory.build({ isFiltering: false, isPublic: false }),
}

xdescribe('TagForm component', () => {
  test('loads', async () => {
    render(
      <TestWrapper>
        <TagForm {...tagFormParams} />
      </TestWrapper>
    )
    await waitFor(() => {
      const groupName = screen.getByTestId('tagGroup')
      expect(groupName).toBeInTheDocument()
      const isPublic = screen.getByTestId('isPublic')
      expect(isPublic).toBeInTheDocument()
      const isFiltering = screen.getByTestId('isFiltering')
      expect(isFiltering).toBeInTheDocument()
    })
  })
  test('if tag is filtering, box should be checked', async () => {
    render(
      <TestWrapper>
        <TagForm {...filteringTag} />
      </TestWrapper>
    )
    await waitFor(() => {
      const isFiltering = screen.getByTestId('isFiltering')
      expect(isFiltering).toBeChecked()
      const isPublic = screen.getByTestId('isPublic')
      expect(isPublic).not.toBeChecked()
    })
  })
  test('if tag is public, box should be checked', async () => {
    render(
      <TestWrapper>
        <TagForm {...publicTag} />
      </TestWrapper>
    )
    await waitFor(() => {
      const isFiltering = screen.getByTestId('isFiltering')
      expect(isFiltering).not.toBeChecked()
      const isPublic = screen.getByTestId('isPublic')
      expect(isPublic).toBeChecked()
    })
  })
  test('if tag is filtering and public, both should be checked', async () => {
    render(
      <TestWrapper>
        <TagForm {...publicAndFilteringTag} />
      </TestWrapper>
    )
    await waitFor(() => {
      const isFiltering = screen.getByTestId('isFiltering')
      expect(isFiltering).toBeChecked()
      const isPublic = screen.getByTestId('isPublic')
      expect(isPublic).toBeChecked()
    })
  })
  test('if tag is not filtering nor public, neither should be checked', async () => {
    render(
      <TestWrapper>
        <TagForm {...neitherPublicNorFilteringTag} />
      </TestWrapper>
    )
    await waitFor(() => {
      const isFiltering = screen.getByTestId('isFiltering')
      expect(isFiltering).not.toBeChecked()
      const isPublic = screen.getByTestId('isPublic')
      expect(isPublic).not.toBeChecked()
    })
  })
  test('multi lingual group shows both langs', async () => {
    const group = currentGroupFactory.build({
      languages: bilingual,
    })
    render(
      <TestWrapper group={group}>
        <TagForm {...tagFormParams} />
      </TestWrapper>
    )
    await waitFor(() => {
      const groupName = screen.getByTestId('tagGroup')
      expect(groupName).toBeInTheDocument()
      const nameEn = screen.getByTestId('nameEn')
      expect(nameEn).toBeInTheDocument()
      const nameFr = screen.getByTestId('nameFr')
      expect(nameFr).toBeInTheDocument()
    })
  })
  test('en only group only shows en field', async () => {
    const group = currentGroupFactory.build({
      languages: enOnly,
    })
    render(
      <TestWrapper group={group}>
        <TagForm {...tagFormParams} />
      </TestWrapper>
    )
    await waitFor(() => {
      const groupName = screen.getByTestId('tagGroup')
      expect(groupName).toBeInTheDocument()
      const nameEn = screen.getByTestId('nameEn')
      expect(nameEn).toBeInTheDocument()
      const nameFr = screen.queryByTestId('nameFr')
      expect(nameFr).not.toBeInTheDocument()
    })
  })
  test('fr only group only shows fr field', async () => {
    const group = currentGroupFactory.build({ languages: frOnly })
    render(
      <TestWrapper group={group}>
        <TagForm {...tagFormParams} />
      </TestWrapper>
    )
    await waitFor(() => {
      const groupName = screen.getByTestId('tagGroup')
      expect(groupName).toBeInTheDocument()
      const nameEn = screen.getByTestId('nameFr')
      expect(nameEn).toBeInTheDocument()
      const nameFr = screen.queryByTestId('nameEn')
      expect(nameFr).not.toBeInTheDocument()
    })
  })
})
