import { Image } from 'components/Image'
import { VerticalWave } from 'components/Wave/VerticalWave'
import { Wave } from 'components/Wave/Wave'
import { useEffect, useState, VFC } from 'react'
import Skeleton from 'react-loading-skeleton'

import { GroupProp } from './Hero'

// @TODO: replace slideshow elements with /Components/display/SlideShow

const TitleImage: VFC<GroupProp> = ({ group, loading }) => {
  const [currentId, setCurrentId] = useState(0)

  const images = group?.backgroundImages?.map((i) => i.imageUrl)

  useEffect(() => {
    if (!images || images?.length < 2) {
      return undefined
    }

    const interval = setInterval(() => {
      setCurrentId((oldId) => (oldId === images.length - 1 ? 0 : oldId + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, images)

  if (!group && !loading) {
    console.error('no group')
    return null
  }

  return (
    <div className="w-full h-full absolute">
      {loading ? (
        <Skeleton width="100%" height="100%" className="absolute z-0" />
      ) : (
        images?.map((image, i) => (
          <Image
            key={image}
            className={`absolute duration-1000 ${
              i === currentId ? 'opacity-100' : 'opacity-0'
            }`}
            alt=""
            src={image}
          />
        ))
      )}
      <div className="hidden md:block w-10 h-full absolute top-0 left-0">
        <VerticalWave color="white" className="" />
      </div>
      <div className="block md:hidden w-full h-full absolute bottom-0 right-0">
        <Wave color="white" flipX={false} />
      </div>
    </div>
  )
}

export default TitleImage
