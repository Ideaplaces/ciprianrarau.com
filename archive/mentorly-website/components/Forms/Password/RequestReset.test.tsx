import '@testing-library/jest-dom'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import TestWrapper from 'mocks/TestWrapper'

import RequestReset from './RequestReset'

jest.mock('next/router', () => require('next-router-mock'))

describe('RequestReset component', () => {
  test.skip('loads and validates email', async () => {
    render(
      <TestWrapper>
        <RequestReset email="something@something.com" />
      </TestWrapper>
    )

    await waitFor(() => {
      const requestReset = screen.getByTestId('request-reset')
      expect(requestReset).toBeInTheDocument()
      const emailField = screen.getByTestId('email')
      expect(emailField).toBeInTheDocument()
      const submitButton = screen.getByTestId('primary')
      expect(submitButton).toBeInTheDocument()
      fireEvent.change(emailField, { target: { value: 'incorrect#email+com' } })
      expect(emailField).toHaveValue('incorrect#email+com')
      fireEvent.click(submitButton)
      const fieldError = screen.getByTestId('field-error')
      expect(fieldError).toBeInTheDocument()
    })
  })
  test('populates with email when provided as prop', async () => {
    render(
      <TestWrapper>
        <RequestReset email="test@test.com" />
      </TestWrapper>
    )

    await waitFor(() => {
      const requestReset = screen.getByTestId('request-reset')
      expect(requestReset).toBeInTheDocument()
      const emailField = screen.getByTestId('email')
      expect(emailField).toBeInTheDocument()
      expect(emailField).toHaveValue('test@test.com')
    })
  })
})
