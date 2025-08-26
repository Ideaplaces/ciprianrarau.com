import { Maybe } from 'types/graphql'

export type CaseStudyQuoteProps = {
  quote?: Maybe<string>
  person: string
  job?: string
  quoteMarkColor?: string
}

export const CaseStudyQuote: React.FC<CaseStudyQuoteProps> = ({
  quote,
  person,
  job,
  quoteMarkColor = 'yellow',
}) => {
  return (
    <figure className="my-8 flex flex-col md:flex-row">
      <div
        className={`text-${quoteMarkColor} leading-none mx-4`}
        style={{ fontSize: '8rem' }}
      >
        &ldquo;
      </div>
      <div>
        <blockquote
          className="mb-6 italic"
          dangerouslySetInnerHTML={{ __html: quote as string }}
        />
        <figcaption>
          <p className="font-black mb-1">{person}</p>
          {job && <p>{job}</p>}
        </figcaption>
      </div>
    </figure>
  )
}
