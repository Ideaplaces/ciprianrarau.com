import Button from 'components/Button/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { FC, useState } from 'react'
import { useIntl } from 'react-intl'

import { demoFormSchema, initialValues } from './validation'

type RequestDemoFormProps = {
  id: string
  onSubmit?: () => void
  onHomepage?: boolean
}

const RequestDemoForm: FC<RequestDemoFormProps> = ({
  id,
  onSubmit,
  onHomepage,
}) => {
  const { locale, formatMessage } = useIntl()
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const onFormSubmit = (values: any) => {
    fetch('https://api.mentorly.com/forms/request_demo', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        locale,
        form_data: values,
        hutk: Cookies.get('hubspotutk'),
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setFormSubmitted(true)
        if (onSubmit) {
          onSubmit()
        }
        Router.push('/[locale]/thank-you', `/${locale}/thank-you`)
      })
      .catch((error) => {
        setFormSubmitted(true)
        console.error('Request failed', error)
      })
  }

  if (formSubmitted) {
    return <div>Done!</div>
  }

  return (
    <Form
      id={`${id}-${locale}`}
      initialValues={initialValues}
      validationSchema={demoFormSchema}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting }: any) => (
        <div className="box">
          <Field
            hideLabel
            placeholder={formatMessage({ id: 'form.email' })}
            name="email"
            type="email"
          />
          <div className="mt-6">
            <Button type="submit" disabled={isSubmitting} full>
              {onHomepage
                ? formatMessage({ id: 'button.bookDemo' })
                : formatMessage({ id: 'button.sendRequest' })}
            </Button>
          </div>
        </div>
      )}
    </Form>
  )
}

export default RequestDemoForm
