import VideoTest from 'components/VideoTest'
import { connectServerSideProps } from 'lib/ssg'

export const getServerSideProps = connectServerSideProps(VideoTest)
export default VideoTest
