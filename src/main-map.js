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

const reportUnsafe = () => {
}

const removeAllMarkers = (map) => {
  map.eachLayer((layer) => {
    if (layer.options && layer.options.pane === "markerPane") {
      map.removeLayer(layer);
    }
  });
}

function createIcon() {
  return L.divIcon({
    className: "custom-icon-marker",
    iconSize: L.point(40, 40),
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker"><path fill-opacity="0.25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/><path stroke="#000000" fill="#e83e4c" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/></svg>`,
    iconAnchor: [12, 24],
    popupAnchor: [9, -26],
  });
}

const ShowMarkers = ({ map, legend, markers }) => {
  return markers.map((marker, index) => {
    return <Marker
      icon={createIcon()}
      key={index}
      uniceid={index}
      position={marker}
      draggable={true}
      eventHandlers={{
        moveend(e) {
          const { lat, lng } = e.target.getLatLng();
          legend.textContent = `change position: ${lat} ${lng}`;
        },
        add(e) {
          var popup = e.target.getPopup();
          popup.setLatLng(e.target.getLatLng());
          map.openPopup(popup);
        }
      }}
    >
      <Popup>
        <Button type='unsafe pill lg popup' text='⚫ Report Unsafe' onClickAction={() => reportUnsafe(index, map, legend)} />
        <Button type='pill lg popup' text='❌ Cancel' onClickAction={() => removeAllMarkers(map)} />
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
      console.log("Click registered, " + marker.length + ' markers on map.');
      removeAllMarkers(map);
      const { lat, lng } = e.latlng;
      setMarker(mar => [...mar, [lat, lng]]);
      setLegend(info);
    })

  }, [map]);

  return marker.length > 0 && legend !== undefined ? (
    <ShowMarkers
      map={map}
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
