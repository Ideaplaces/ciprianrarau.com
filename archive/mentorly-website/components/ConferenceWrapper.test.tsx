import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { mockConferenceWrapper } from 'mocks'
import TestWrapper from 'mocks/TestWrapper'
import mockRouter from 'next-router-mock'
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes'
import { SessionTypeEnum } from 'types/graphql'

import ConferenceWrapper from './ConferenceWrapper'

jest.mock('next/router', () => require('next-router-mock'))
mockRouter.useParser(createDynamicRouteParser(['/sessions/[id]']))
const sessionId = '1a2b3c4d5e'

describe('ConferenceWrapper', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(`/sessions/${sessionId}`)
  })

  test('should parse dynamic routes', () => {
    expect(mockRouter).toMatchObject({
      pathname: '/sessions/[id]',
      query: { id: sessionId },
    })
  })

  test('loads and displays sign-in for non-logged-in visitor', async () => {
    render(
      <TestWrapper withoutCurrentUser>
        <ConferenceWrapper>{() => <></>}</ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByTestId('session-login')
      expect(children).toBeInTheDocument
    })
  })

  test('loads children if user is part of individual session', async () => {
    const variables = {
      id: sessionId,
      sessionType: 'individual_session' as SessionTypeEnum,
      isParticipating: true,
    }
    render(
      <TestWrapper mocks={[mockConferenceWrapper(variables)]}>
        <ConferenceWrapper>{() => <p>children will load</p>}</ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByText('children will load')
      expect(children).toBeInTheDocument
    })
  })

  test('loads children if user is part of group session', async () => {
    const variables = {
      id: sessionId,
      sessionType: 'group_session' as SessionTypeEnum,
      isParticipating: true,
    }
    render(
      <TestWrapper mocks={[mockConferenceWrapper(variables)]}>
        <ConferenceWrapper>{() => <p>children will load</p>}</ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.getByText('children will load')
      expect(children).toBeInTheDocument
    })
  })

  test('redirects to error if user is not part of individual session', async () => {
    const variables = {
      id: sessionId,
      sessionType: 'individual_session' as SessionTypeEnum,
      isParticipating: false,
    }
    render(
      <TestWrapper mocks={[mockConferenceWrapper(variables)]}>
        <ConferenceWrapper>
          {() => <p>children will not load</p>}
        </ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.queryByText('children will not load')
      expect(children).not.toBeInTheDocument
      expect(mockRouter.asPath).toContain('/error')
    })
  })

  test('redirects to error if user is not part of group session', async () => {
    const variables = {
      id: sessionId,
      sessionType: 'group_session' as SessionTypeEnum,
      isParticipating: false,
    }
    render(
      <TestWrapper mocks={[mockConferenceWrapper(variables)]}>
        <ConferenceWrapper>
          {() => <p>children will not load</p>}
        </ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.queryByText('children will not load')
      expect(children).not.toBeInTheDocument
      expect(mockRouter.asPath).toContain('/error')
    })
  })

  test('always renders for masterclass', async () => {
    const variables = {
      id: sessionId,
      sessionType: 'masterclass' as SessionTypeEnum,
      isParticipating: false,
    }
    render(
      <TestWrapper mocks={[mockConferenceWrapper(variables)]}>
        <ConferenceWrapper>{() => <p>children will load</p>}</ConferenceWrapper>
      </TestWrapper>
    )

    await waitFor(() => {
      const children = screen.queryByText('children will load')
      expect(children).toBeInTheDocument
    })
  })
})
