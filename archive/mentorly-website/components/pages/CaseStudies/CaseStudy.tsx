import { CaseStudyQuote } from 'components/Blockquote'
import { CaseStudyQuoteProps } from 'components/Blockquote/Blockquote'
import { H4 } from 'components/Headings'
import Video from 'components/Video'
import React, { FC } from 'react'
import { Maybe } from 'types/graphql'

type CaseStudyProps = {
  client?: Maybe<string>
  description?: Maybe<string>
  videoUrl?: Maybe<string>
  quote?: Maybe<string>
}
const CaseStudy: FC<CaseStudyProps & CaseStudyQuoteProps> = ({
  client,
  description,
  videoUrl,
  ...props
}) => {
  return (
    <div className="mb-10">
      {client && <H4>{client}</H4>}
      <div
        className="mb-10 rich-text"
        dangerouslySetInnerHTML={{ __html: description as string }}
      />
      {props.quote && <CaseStudyQuote {...props} />}
      {videoUrl && <Video url={videoUrl} />}
    </div>
  )
}

export default CaseStudy
