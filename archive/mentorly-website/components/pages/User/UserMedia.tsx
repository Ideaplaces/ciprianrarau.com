import { gql } from '@apollo/client'
import ProfilePicture from 'components/display/ProfilePicture'
import RenderMedia from 'components/display/RenderMedia'
import Slider from 'components/Slider/Slider'
import { FC } from 'react'
import {
  ProfilePictureFieldsFragment,
  ProfilePictureFieldsFragmentDoc,
  RenderMediaFieldsFragment,
  RenderMediaFieldsFragmentDoc,
} from 'types/graphql'

gql`
  fragment UserMediaFields on User {
    ...ProfilePictureFields
    files {
      ...RenderMediaFields
    }
  }
  ${RenderMediaFieldsFragmentDoc}
  ${ProfilePictureFieldsFragmentDoc}
`

type UserMediaProps = {
  files: RenderMediaFieldsFragment[]
  user: ProfilePictureFieldsFragment
}

const UserMedia: FC<UserMediaProps> = ({ files, user }) => {
  const gallery = user.profileImageUrl
    ? [{ fileUrl: user.profileImageUrl }, ...files]
    : files

  const fileList = gallery?.map((file, i) => (
    <RenderMedia key={i} file={file} />
  ))

  if (fileList.length === 0) {
    return <ProfilePicture user={user} />
  }

  if (fileList.length === 1) {
    return fileList[0]
  }

  // @TODO: pause video when slider advances
  return <Slider>{fileList}</Slider>
}

export default UserMedia
