import { getIn } from 'formik'
import { Schema, TestFunction } from 'yup'

export const isRequiredField = (
  validationSchema: Schema<any, any>,
  name: string | string[]
) =>
  !!getIn(validationSchema?.describe().fields, name)?.tests.find(
    (test: TestFunction) => test.name === 'required'
  )
