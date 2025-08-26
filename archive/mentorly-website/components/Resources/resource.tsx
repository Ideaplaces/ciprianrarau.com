import { ButtonLink } from 'components/Button'
import Link from 'next/link'
import { File, Link2 } from 'react-feather'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

export type ResourceType = {
  title: string
  description?: Maybe<string>
  customUrl?: Maybe<string>
  fileUrl?: Maybe<string>
}

type ResourceProps = {
  resource: ResourceType
}

const Resource = ({ resource }: ResourceProps) => {
  const { formatMessage } = useIntl()

  return (
    <li className="py-6 px-6 border-gray gap-4 flex flex-col md:flex-row items-center">
      <div className="hidden sm:block">
        {resource.fileUrl ? <File /> : <Link2 />}
      </div>
      <div className="flex-1">
        <div className="text-lg font-bold mb-1">{resource.title}</div>
        <div className="text-sm text-evenDarkerGray">
          {resource.description}
        </div>
      </div>
      {resource.fileUrl && (
        <Link href={resource.fileUrl} download={resource.title} passHref>
          <ButtonLink
            className="w-full sm:w-auto"
            variant="secondary"
            target="_blank"
          >
            {formatMessage({ id: 'button.download' })}
          </ButtonLink>
        </Link>
      )}
      {resource.customUrl && (
        <Link href={resource.customUrl} passHref>
          <ButtonLink
            className="w-full sm:w-auto"
            variant="secondary"
            target="_blank"
          >
            {formatMessage({ id: 'button.viewLink' })}
          </ButtonLink>
        </Link>
      )}
    </li>
  )
}

export default Resource
