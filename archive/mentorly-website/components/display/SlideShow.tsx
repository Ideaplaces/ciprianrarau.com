import { useEffect, useState, VFC } from 'react'

export type SlideShowProps = {
  media: Array<{
    length: number
    id: string
    fileUrl: string
  }>
}
const SlideShow: VFC<SlideShowProps> = ({ media }) => {
  const [currentId, setCurrentId] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentId((oldId) => (oldId === media.length - 1 ? 0 : oldId + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [media])

  // below doesn't work
  // const type = (file) => file['type'].split('/')[0]

  // @TODO: if type is video, render in video player
  // @TODO: make sure component works responsively
  // not sure how relative sm:absolute will behave in other contexts
  return (
    <>
      {media.map((file, i) => (
        <div
          key={file.id}
          className={`relative sm:absolute duration-1000 left-0 right-0 top-0 height-0 ${
            i === currentId ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img className="mx-auto" alt="" src={file.fileUrl} />
        </div>
      ))}
    </>
  )
}

const SlideShowWrapper: VFC<SlideShowProps> = ({ media }) => {
  if (media?.length < 1) {
    return null
  }

  return <SlideShow media={media} />
}

export default SlideShowWrapper
