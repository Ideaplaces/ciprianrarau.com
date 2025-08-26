import * as Sentry from '@sentry/browser'
import { Component, ReactNode } from 'react'

import Alert from './feedback/Alert'

type ErrorBoundaryProps = {
  children: ReactNode
  props: any
}
type ErrorBoundaryState = {
  error: unknown
  hasError: boolean
}

type ErrorBoundaryType = {
  children: ReactNode
  props?: ErrorBoundaryProps
}

class ErrorBoundary extends Component<ErrorBoundaryType> {
  state: ErrorBoundaryState = {
    error: null,
    hasError: false,
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      error,
      hasError: true,
    }
  }

  componentDidCatch(error: unknown, errorInfo: Record<string, any>) {
    console.warn(this.props.props)

    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })

      Sentry.captureException(error)
    })
  }

  render() {
    if (this.state.hasError) {
      console.error(this.state.error)
      return (
        <Alert type="error" showIcon>
          An error occured
        </Alert>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
