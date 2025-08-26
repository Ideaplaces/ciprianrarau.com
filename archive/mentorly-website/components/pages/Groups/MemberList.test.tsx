import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { userFactory } from 'factories/user'
import TestWrapper from 'mocks/TestWrapper'

import MemberList from './MemberList'

jest.mock('next/router', () => require('next-router-mock'))

const mentors = userFactory.buildList(3)

describe('MemberList', () => {
  describe('group without mentors', () => {
    test('shows nothing on frontpage', async () => {
      render(
        <TestWrapper withoutCurrentUser>
          <MemberList
            frontPage={true}
            query={undefined}
            setQuery={undefined}
            mentors={[]}
            limit={0}
            mentorCount={0}
            isFiltering={false}
          />
        </TestWrapper>
      )

      await waitFor(() => {
        const memberList = screen.queryByTestId('member-list')
        expect(memberList).not.toBeInTheDocument
        const memberCards = screen.queryAllByTestId('member-card')
        expect(memberCards).not.toBeInTheDocument
        expect(memberCards?.length).not.toBeGreaterThan(0)
      })
    })
  })
  describe('group with mentors', () => {
    test('loads and displays members on frontpage', async () => {
      render(
        <TestWrapper withoutCurrentUser>
          <MemberList
            frontPage={true}
            query={undefined}
            setQuery={undefined}
            mentors={mentors}
            limit={mentors.length}
            mentorCount={mentors.length}
            isFiltering={false}
          />
        </TestWrapper>
      )

      await waitFor(() => {
        const memberList = screen.getByTestId('member-list')
        expect(memberList).toBeInTheDocument
        const memberCards = screen.getAllByTestId('member-card')
        expect(memberCards).toBeInTheDocument
        expect(memberCards.length).toBe(mentors.length)
      })
    })
    test('non front-page shows all members, pagination', async () => {
      render(
        <TestWrapper withoutCurrentUser>
          <MemberList
            frontPage={false}
            query={undefined}
            setQuery={undefined}
            mentors={mentors}
            limit={mentors.length}
            mentorCount={mentors.length}
            isFiltering={false}
          />
        </TestWrapper>
      )

      await waitFor(() => {
        const memberList = screen.getByTestId('member-list')
        expect(memberList).toBeInTheDocument
        const memberCards = screen.getAllByTestId('member-card')
        expect(memberCards).toBeInTheDocument
        expect(memberCards.length).toBe(mentors.length)
        const pagination = screen.getByTestId('pagination')
        expect(pagination).toBeInTheDocument
      })
    })
  })
})
