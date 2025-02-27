import Map, { MapProps } from '../../map/Map'
import { regions, RegionType } from './data'

/**
 * Component displaying a map of Denmark with five regions.
 */
export default function Regions(props: MapProps<RegionType>) {
  return <Map areas={regions} defaultViewBoxWidth={13489} defaultViewBoxHeight={16389} {...props} />
}
