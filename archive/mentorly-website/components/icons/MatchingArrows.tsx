import type { Icon } from 'react-feather'

const MatchingArrows: Icon = ({ color = '#111', size = 20 }) => (
  <div className="px-[2px]">
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 13L6.5 7L12.5 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.90002 7.40002L12.9 13.4L6.90002 19.4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.20001 6.90002H18.6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 13.4H12.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export default MatchingArrows
