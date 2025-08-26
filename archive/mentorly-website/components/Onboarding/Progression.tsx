import classNames from 'classnames'
import { getFeatureFlag } from 'components/Feature'
import { useCurrentGroup } from 'lib/GroupContext'
import { OnboardingFormsProps } from 'pages/[locale]/onboarding'
import { FC, ReactNode, VFC } from 'react'
import { Icon, User, Users } from 'react-feather'
import { useIntl } from 'react-intl'

type ProgressionProps = Omit<
  OnboardingFormsProps,
  'goNext' | 'goPrev' | 'formKey' | 'user'
>

// programQuestions

const Progression: VFC<ProgressionProps> = ({ step, noMatching }) => {
  const { currentGroup } = useCurrentGroup()

  const matchingQuestionsKey = getFeatureFlag(
    currentGroup,
    'matchingQuestionsKey'
  ) as string

  const lastLabel = noMatching ? 'questions' : matchingQuestionsKey

  return (
    <div className="flex items-center justify-center mb-12 my-2 mx-auto w-3/4 text-white">
      <Step Icon={User} index={0} label="basicInformation" step={step} />

      <Connector index={1} step={step} />

      <Step Icon={Users} index={1} label={lastLabel} step={step} />
    </div>
  )
}

type ProgressionComponentsProps = {
  index: number
  step: number
}

const Connector: VFC<ProgressionComponentsProps> = ({ index, step }) => (
  <div
    className={classNames(
      'items-center justify-center w-full h-[2px] mb-6 -mx-12 z-5 hidden md:block',
      step >= index ? 'bg-accentColor' : 'bg-darkGray'
    )}
  ></div>
)

const Label: FC<ProgressionComponentsProps & { children?: ReactNode }> = ({
  children,
  index,
  step,
}) => (
  <span
    className={classNames(
      'text-center block pt-1',
      step >= index ? 'text-accentColor' : 'text-darkGray',
      step === index && 'font-bold'
    )}
  >
    {children}
  </span>
)

type StepProps = {
  step: number
  Icon: Icon
  index: number
  label: any
}
const Step: VFC<StepProps> = ({ step, Icon, index, label }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="w-sm">
      <div
        className={classNames(
          'w-10 h-10 my-0 mx-auto rounded-full p-3 flex items-center justify-center z-10 relative',
          step >= index ? 'bg-accentColor' : 'bg-darkGray'
        )}
      >
        {<Icon />}
      </div>
      <Label index={index} step={step}>
        {formatMessage({ id: `term.${label}` })}
      </Label>
    </div>
  )
}

export default Progression
