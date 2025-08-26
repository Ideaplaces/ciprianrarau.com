import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { currentGroupWithGlobalStats } from 'mocks'
import TestWrapper from 'mocks/TestWrapper'
import mockRouter from 'next-router-mock'
import { ManagedGroup } from 'types/graphql'

import Overview from './Overview'

jest.mock('next/router', () => require('next-router-mock'))

describe('Overview component', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/dashboard')
  })
  test('loads and displays group name', async () => {
    render(
      <TestWrapper withoutCurrentUser>
        <Overview
          group={currentGroupWithGlobalStats as unknown as ManagedGroup}
          loading={false}
        />
      </TestWrapper>
    )
    await waitFor(() => {
      const groupName = screen.getByTestId('group-name').innerHTML
      expect(groupName).toBe(currentGroupWithGlobalStats.name)
    })
  })
})
