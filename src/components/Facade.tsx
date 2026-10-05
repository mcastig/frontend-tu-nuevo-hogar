import type { CSSProperties } from 'react'
import type { FacadeVariant, Project } from '../data/site.ts'

type Box = { x: number; y: number; w: number; h: number }

type Shape = {
  wall: Box
  door: Box
  windows: Box[]
  balcony: Box | null
  waterTankX: number
}

// Elevations on a 240 × 300 canvas; the ground sits at y = 300.
const SHAPES: Record<FacadeVariant, Shape> = {
  'two-story': {
    wall: { x: 14, y: 62, w: 212, h: 238 },
    door: { x: 44, y: 196, w: 50, h: 104 },
    windows: [
      { x: 40, y: 94, w: 58, h: 64 },
      { x: 142, y: 94, w: 58, h: 64 },
      { x: 128, y: 200, w: 72, h: 54 },
    ],
    balcony: null,
    waterTankX: 164,
  },
  balcony: {
    wall: { x: 24, y: 92, w: 192, h: 208 },
    door: { x: 146, y: 208, w: 44, h: 92 },
    windows: [
      { x: 90, y: 118, w: 60, h: 72 },
      { x: 48, y: 214, w: 64, h: 44 },
    ],
    balcony: { x: 76, y: 172, w: 88, h: 22 },
    waterTankX: 40,
  },
  'one-story': {
    wall: { x: 10, y: 152, w: 220, h: 148 },
    door: { x: 36, y: 206, w: 46, h: 94 },
    windows: [{ x: 110, y: 206, w: 92, h: 50 }],
    balcony: null,
    waterTankX: 176,
  },
  residence: {
    wall: { x: 6, y: 40, w: 228, h: 260 },
    door: { x: 32, y: 184, w: 58, h: 116 },
    windows: [
      { x: 26, y: 70, w: 70, h: 78 },
      { x: 140, y: 70, w: 70, h: 78 },
      { x: 122, y: 188, w: 92, h: 64 },
    ],
    balcony: { x: 128, y: 132, w: 94, h: 22 },
    waterTankX: 184,
  },
}

const BAND_HEIGHT = 40
const BALUSTERS = [0.2, 0.4, 0.6, 0.8]

const LIGHT_KNOB = '#f8f6f1'
const DARK_KNOB = '#1b2559'

// Perceived brightness of a #rrggbb colour, from 0 (black) to 255 (white).
function brightness(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  return 0.299 * (value >> 16) + 0.587 * ((value >> 8) & 255) + 0.114 * (value & 255)
}

// The knob has to stand out from its door: light on a dark door, dark on a light one.
function knobColor(door: string) {
  return brightness(door) < 128 ? LIGHT_KNOB : DARK_KNOB
}

function archPath({ x, y, w, h }: Box) {
  const r = w / 2
  return `M${x} ${y + h}V${y + r}a${r} ${r} 0 0 1 ${w} 0V${y + h}z`
}

type FacadeProps = {
  variant: FacadeVariant
  colors: Project['colors']
}

export function Facade({ variant, colors }: FacadeProps) {
  const { wall, door, windows, balcony, waterTankX } = SHAPES[variant]
  const doorPath = archPath(door)
  const style = {
    '--wall': colors.wall,
    '--band': colors.band,
    '--door': colors.door,
    '--knob': knobColor(colors.door),
  } as CSSProperties

  return (
    <svg
      viewBox="0 0 240 300"
      className="facade"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {/* Rooftop water tank */}
      <g className="facade__ink">
        <rect x={waterTankX + 3} y={wall.y - 14} width="3" height="8" />
        <rect x={waterTankX + 20} y={wall.y - 14} width="3" height="8" />
        <rect x={waterTankX} y={wall.y - 34} width="26" height="22" rx="5" />
        <rect x={waterTankX + 8} y={wall.y - 38} width="10" height="5" rx="2" />
      </g>

      <rect className="facade__wall" x={wall.x} y={wall.y} width={wall.w} height={wall.h} />
      <rect className="facade__band" x={wall.x - 6} y={wall.y - 8} width={wall.w + 12} height="12" />
      <rect
        className="facade__band"
        x={wall.x}
        y={300 - BAND_HEIGHT}
        width={wall.w}
        height={BAND_HEIGHT}
      />

      {windows.map((w) => (
        <g key={`${w.x}-${w.y}`}>
          <rect className="facade__frame" x={w.x} y={w.y} width={w.w} height={w.h} />
          <rect className="facade__glass" x={w.x + 5} y={w.y + 5} width={w.w - 10} height={w.h - 10} />
          <rect className="facade__frame" x={w.x + w.w / 2 - 1.5} y={w.y} width="3" height={w.h} />
        </g>
      ))}

      {balcony ? (
        <g className="facade__ink">
          <rect x={balcony.x} y={balcony.y} width={balcony.w} height="4" />
          <rect x={balcony.x} y={balcony.y + balcony.h - 4} width={balcony.w} height="4" />
          {BALUSTERS.map((t) => (
            <rect key={t} x={balcony.x + balcony.w * t - 1.5} y={balcony.y} width="3" height={balcony.h} />
          ))}
        </g>
      ) : null}

      <path className="facade__light" d={doorPath} />
      <g className="facade__door">
        <path d={doorPath} />
        <circle className="facade__knob" cx={door.x + door.w - 9} cy={door.y + door.h * 0.58} r="2.6" />
      </g>
    </svg>
  )
}
