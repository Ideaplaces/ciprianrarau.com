import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { mentee, mentor, mockMentorAvailabilitySameGroup } from 'mocks'
import TestWrapper from 'mocks/TestWrapper'

import MemberCard from './MemberCard'

jest.mock('next/router', () => require('next-router-mock'))

describe('MemberCard', () => {
  test('loads and displays the memberCard with expected sub-components for mentor', async () => {
    render(
      <TestWrapper mocks={[mockMentorAvailabilitySameGroup]}>
        <MemberCard user={mentor} showBook={true} showMessage={true} />
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByTestId('member-card')
      expect(children).toBeInTheDocument
      const profilePicture = screen.findByTestId('profile-picture')
      expect(profilePicture).toBeInTheDocument
      const viewProfileButton = screen.getByTestId('view-profile-button')
      expect(viewProfileButton).toBeInTheDocument
      const bookButton = screen.findByTestId('book-button')
      expect(bookButton).toBeInTheDocument
      const messageUserLink = screen.getByTestId('message-user-link')
      expect(messageUserLink).toBeInTheDocument
    })
  })

  test('loads and displays the memberCard with expected sub-components for mentee', async () => {
    render(
      <TestWrapper mocks={[mockMentorAvailabilitySameGroup]}>
        <MemberCard user={mentee} showBook={true} showMessage={true} />
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByTestId('member-card')
      expect(children).toBeInTheDocument
      const profilePicture = screen.findByTestId('profile-picture')
      expect(profilePicture).toBeInTheDocument
      const viewProfileButton = screen.getByTestId('view-profile-button')
      expect(viewProfileButton).toBeInTheDocument
      const bookButton = screen.queryByTestId('book-button')
      expect(bookButton).not.toBeInTheDocument
      const messageUserLink = screen.getByTestId('message-user-link')
      expect(messageUserLink).toBeInTheDocument
    })
  })

  test('hides viewProfile and bookButton when properties are false or undefiend', async () => {
    render(
      <TestWrapper mocks={[mockMentorAvailabilitySameGroup]}>
        <MemberCard user={mentor} />
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByTestId('member-card')
      expect(children).toBeInTheDocument
      const viewProfileButton = screen.getByTestId('view-profile-button')
      expect(viewProfileButton).not.toBeInTheDocument
      const bookButton = screen.queryByTestId('book-button')
      expect(bookButton).not.toBeInTheDocument
      const messageUserLink = screen.queryByTestId('message-user-link')
      expect(messageUserLink).not.toBeInTheDocument
    })
  })
})
