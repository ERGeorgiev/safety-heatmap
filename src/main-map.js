import { useState, useEffect } from 'react';
import { Marker, MapContainer, TileLayer, Popup } from 'react-leaflet';
import Button from './components/Button';
import L from 'leaflet';
import tileLayer from './tileLayer';

// ToDo: If marker exists when clicked, move marker where the click is instead of creating a new one.
// Why not create a new one? As we plan to add details to the marker in the future,
// moving it would be better as it would keep the details.

// ToDo: 

const center = [52.07221, -1.01463];

const reportUnsafe = (index, map, legend) => {
}

const reportSafe = (index, map, legend) => {
}

const removeMarker = (index, map, legend) => {
  map.eachLayer((layer) => {
    if (layer.options && layer.options.pane === "markerPane") {
      if (layer.options.uniceid === index) {
        map.removeLayer(layer);
      }
    }
  });
}

const ShowMarkers = ({ mapContainer, legend, markers }) => {
  return markers.map((marker, index) => {
    return <Marker
      key={index}
      uniceid={index}
      position={marker}
      draggable={true}
      eventHandlers={{
        moveend(e) {
          const { lat, lng } = e.target.getLatLng();
          legend.textContent = `change position: ${lat} ${lng}`;
        }
      }}
    >
      <Popup>
        <Button type='unsafe pill lg popup' text='⚫ Report Unsafe' onClickAction={() => reportUnsafe(index, mapContainer, legend)} />
        <Button type='pill lg popup' text='❌ Cancel' onClickAction={() => removeMarker(index, mapContainer, legend)} />
      </Popup>
    </Marker>
  })
}

const MyMarkers = ({ map }) => {
  const [marker, setMarker] = useState([])
  const [legend, setLegend] = useState()

  useEffect(() => {
    if (!map) return;
    const legend = L.control({ position: "bottomleft" });

    const info = L.DomUtil.create("div", "legend");

    legend.onAdd = () => {
      info.textContent = `Click anywhere on the map to add a report.`;
      return info;
    };

    legend.addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setMarker(mar => [...mar, [lat, lng]]);

      info.textContent = `new marker: ${e.latlng}`;
      setLegend(info);
    })

  }, [map]);

  return marker.length > 0 && legend !== undefined ? (
    <ShowMarkers
      mapContainer={map}
      legend={legend}
      markers={marker} />
  )
    : null
}

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  return (
    <MapContainer whenCreated={setMap} center={center} zoom={15} scrollWheelZoom={true}>
      <TileLayer {...tileLayer} />
      <MyMarkers map={map} />
    </MapContainer>
  )
}

export default MapWrapper;
