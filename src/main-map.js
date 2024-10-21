import { MapContainer, TileLayer } from 'react-leaflet';
import tileLayer from './tileLayer';

const center = [52.07221, -1.01463];

const MapWrapper = () => {
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom={true}>
      <TileLayer {...tileLayer} />
    </MapContainer>
  )
}

export default MapWrapper;