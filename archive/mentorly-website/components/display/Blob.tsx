import { VFC } from 'react'

type BlobProps = {
  width?: string
  color?: string
  className?: string
}

const Blob: VFC<BlobProps> = ({
  width = '100vw',
  color = 'yellow',
  className,
}) => (
  <svg
    viewBox="0 0 1440 1252"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    className={className}
    preserveAspectRatio="none"
    style={{ zIndex: -10 }}
  >
    <path
      d="M1440 866.118C1316.98 879.433 1168.86 869.165 1019.24 747.072C1013.74 752.061 1008.18 757.187 1002.54 762.451C469.566 1260.63 245.969 918.355 187.276 766.99C148.233 666.301 97.1469 590.346 1.00064e-05 594.479V525.854L1440 484V866.118Z"
      fill={color}
    />
    <path
      d="M-0.00012207 158.586C123.4 145.17 271.985 155.516 422.075 278.544C427.587 273.517 433.171 268.351 438.824 263.048C973.466 -238.944 1197.76 105.95 1256.64 258.473C1295.8 359.933 1347.05 436.47 1444.5 432.306V501.456L-0.00012207 543.63V158.586Z"
      fill={color}
    />
  </svg>
)

export default Blob
