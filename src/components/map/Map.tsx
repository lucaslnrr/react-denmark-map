import { useState, MouseEvent, CSSProperties, MouseEventHandler, ReactNode } from 'react'
import '../../styles.css'

export type Area = {
  id: string
  da_id: string
  name: string
  d: string
}

export interface MapProps<Type extends Area> {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  color?: string
  showTooltip?: boolean
  customTooltip?: (area: Type) => ReactNode
  onClick?: (area: Type) => void
  onHover?: (area: Type) => void
  customizeAreas?: (area: Type) => { className?: string; style?: CSSProperties } | undefined
}

interface PrivateMapProps<Type extends Area> extends MapProps<Type> {
  areas: Type[]
  viewBoxWidth: string
  viewBoxHeight: string
}

const defaultProps = {
  width: 'auto',
  height: 'auto',
  color: '#ccc',
  showTooltip: true
}

export default function Map<Type extends Area>(props: PrivateMapProps<Type>) {
  const [hoveredArea, setHoveredArea] = useState<Type | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({
    position: 'absolute',
    display: 'none',
    top: 0,
    left: 0
  })

  const handleClick = (event: MouseEvent<SVGPathElement>) => {
    const { onClick } = props
    if (!onClick) return

    const area = props.areas.find((area) => area.id === event.currentTarget.id)
    area && onClick(area)
  }

  const handleHover = (event: MouseEvent<SVGPathElement>) => {
    const { onHover } = props
    if (!onHover) return

    const area = props.areas.find((area) => area.id === event.currentTarget.id)
    area && onHover(area)
  }

  const handleMouseMove: MouseEventHandler = (event) => {
    if (!props.showTooltip) return

    setTooltipStyle((prevState) => ({
      ...prevState,
      top: event.pageY - 20,
      left: event.pageX + 20
    }))
  }

  const handleMouseEnter = (event: MouseEvent<SVGPathElement>) => {
    if (!props.showTooltip) return

    const area = props.areas.find((area) => area.id === event.currentTarget.id)

    setHoveredArea(area ? area : null)
    setTooltipStyle((prevState) => ({
      ...prevState,
      display: 'block'
    }))
  }

  const handleMouseLeave = () => {
    if (!props.showTooltip) return

    setHoveredArea(null)
    setTooltipStyle((prevState) => ({
      ...prevState,
      display: 'none'
    }))
  }

  const getAreas = () => {
    const { areas, customizeAreas } = props

    return areas.map((municipality) => {
      const attributes = customizeAreas ? customizeAreas(municipality) : null

      return (
        <path
          key={municipality.id}
          id={municipality.id}
          data-da_id={municipality.da_id}
          data-name={municipality.name}
          d={municipality.d}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseOver={handleHover}
          style={attributes?.style}
          className={
            attributes?.className
              ? `react-denmark-map-municipality ${attributes.className}`
              : 'react-denmark-map-municipality'
          }
        />
      )
    })
  }

  const defaultTooltip = (area: Area) => {
    const tooltipStyle = {
      fontWeight: '500',
      background: 'white',
      borderRadius: '4px',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
      padding: '6px 12px'
    }

    return (
      <div id="react-denmark-map-tooltip" style={tooltipStyle}>
        <p style={{ margin: '0px' }}>{area.name}</p>
      </div>
    )
  }

  const tooltip = props.customTooltip ? props.customTooltip : defaultTooltip

  return (
    <figure id="react-denmark-map" style={{ textAlign: 'center' }}>
      <div id="react-denmark-map-tooltip-wrapper" style={tooltipStyle}>
        {hoveredArea && tooltip(hoveredArea)}
      </div>
      <svg
        id="react-denmark-map-svg"
        viewBox={`0 0 ${props.viewBoxWidth} ${props.viewBoxHeight}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        style={{
          width: props.width,
          height: props.height,
          fill: props.color,
          margin: '0 auto',
          maxWidth: '1180px',
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinejoin: 'round',
          strokeMiterlimit: 2
        }}
      >
        <g>{getAreas()}</g>
      </svg>
    </figure>
  )
}

Map.defaultProps = defaultProps
