import * as Yup from 'yup'

type DemoForm = {
  email: string
}

export const demoFormSchema = Yup.object().shape<DemoForm>({
  email: Yup.string().required('* Required'),
})

export const initialValues = {
  email: '',
}
