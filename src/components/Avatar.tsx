import type { Avatar as AvatarConfig, HairStyle } from '../data/site.ts'

// Illustrated portraits on a 120 × 160 canvas, the same ratio as the doorway.

const HAIR_CAP =
  'M34 66C32 41 48 36 60 36c12 0 28 5 26 30-5-9-13-15-26-16-13 1-21 7-26 16z'
const BUZZ_CAP = 'M36 60c0-16 12-21 24-21s24 5 24 21c-6-9-14-13-24-13s-18 4-24 13z'
const SHOULDERS = 'M12 160c0-34 22-48 48-48s48 14 48 48z'
const BEARD = 'M35 74c1 26 13 31 25 31s24-5 25-31c-4 13-13 18-25 18s-21-5-25-18z'
const CURLS = [
  [38, 52],
  [48, 43],
  [60, 39],
  [72, 43],
  [82, 52],
  [35, 63],
  [85, 63],
]

function BackHair({ style }: { style: HairStyle }) {
  if (style === 'long') return <rect x="29" y="40" width="62" height="92" rx="28" />
  if (style === 'bob') return <rect x="30" y="40" width="60" height="58" rx="27" />
  if (style === 'bun') return <circle cx="60" cy="29" r="12" />
  return null
}

function FrontHair({ style }: { style: HairStyle }) {
  if (style === 'buzz') return <path d={BUZZ_CAP} />
  if (style === 'curly')
    return (
      <>
        {CURLS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="10.5" />
        ))}
      </>
    )
  return <path d={HAIR_CAP} />
}

export function Avatar({ skin, hair, hairStyle, shirt, glasses, beard, earrings }: AvatarConfig) {
  return (
    <svg className="avatar" viewBox="0 0 120 160" aria-hidden="true" focusable="false">
      <g fill={hair}>
        <BackHair style={hairStyle} />
      </g>

      <path d={SHOULDERS} fill={shirt} />
      <rect x="50" y="90" width="20" height="30" rx="9" fill={skin} />
      <path d="M50 104h20v6a10 10 0 0 1-20 0z" fill="#121a42" opacity=".14" />

      <circle cx="35" cy="73" r="5.5" fill={skin} />
      <circle cx="85" cy="73" r="5.5" fill={skin} />
      <ellipse cx="60" cy="70" rx="25" ry="29" fill={skin} />

      {beard ? <path d={BEARD} fill={hair} /> : null}

      <g fill={hair}>
        <FrontHair style={hairStyle} />
      </g>

      <circle cx="50" cy="71" r="2.7" fill="#121a42" />
      <circle cx="70" cy="71" r="2.7" fill="#121a42" />
      <path
        d="M52 82q8 7 16 0"
        fill="none"
        stroke="#121a42"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {glasses ? (
        <g fill="none" stroke="#121a42" strokeWidth="2.2">
          <circle cx="50" cy="71" r="7.5" />
          <circle cx="70" cy="71" r="7.5" />
          <path d="M57.5 71h5M42.5 70l-6-2M77.5 70l6-2" strokeLinecap="round" />
        </g>
      ) : null}

      {earrings ? (
        <g fill="#f5b82e">
          <circle cx="35" cy="81" r="3" />
          <circle cx="85" cy="81" r="3" />
        </g>
      ) : null}
    </svg>
  )
}
