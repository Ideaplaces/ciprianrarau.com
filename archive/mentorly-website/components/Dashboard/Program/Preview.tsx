import classNames from 'classnames'
import callApi from 'lib/callApi'
import { connectServerSideProps } from 'lib/ssg'
import { useEffect, useState, VFC } from 'react'

type PreviewProps = {
  className?: string
  markdown?: string
}

const Preview: VFC<PreviewProps> = ({ className, markdown }) => {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const previewJSON = async () => {
      const result = await callApi('previews', { text: markdown || '' })

      setHtml(result.html)
    }

    previewJSON()
  }, [markdown])

  return (
    <>
      <div
        className={classNames('my-4', className)}
        style={{ width: '600px' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

export const getServerSideProps = connectServerSideProps(Preview)
export default Preview
