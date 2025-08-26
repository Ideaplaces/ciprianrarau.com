import { useIntl } from 'react-intl'

type FormHeaderProps = {
  step: number
  formKey?: string
  noMatching?: boolean
}

const FormHeader = ({ step, formKey }: FormHeaderProps) => {
  const { formatMessage } = useIntl()

  if (!formKey && !step) return null

  const messages = {
    title: formatMessage({ id: `form.onboarding.${formKey}.title` }),
    description: formatMessage({
      id: `form.onboarding.${formKey}.description`,
    }),
  }
  return (
    <div className="mb-6">
      <div className="flex justify-between flex-col-reverse md:flex-row gap-2">
        {formKey && (
          <h2 className="text-xl text-black font-bold">{messages?.title}</h2>
        )}
        {
          <span className="text-black">
            {formatMessage({ id: 'term.step' })} {step + 1} / 2
          </span>
        }
      </div>
      {/* <p>{messages?.description}</p> */}
    </div>
  )
}

export default FormHeader
