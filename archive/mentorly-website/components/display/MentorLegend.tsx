import MentorBadge from './MentorBadge'

const MentorLegend = () => {
  return (
    <div className="flex items-center">
      <MentorBadge />
      <div className="ml-2 text-sm leading-3 text-darkerGray">Mentor</div>
    </div>
  )
}

export default MentorLegend
