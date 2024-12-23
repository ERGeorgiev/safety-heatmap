import { useState, useEffect } from 'react';
import { Marker, MapContainer, TileLayer, Popup } from 'react-leaflet';
import Button from './components/Button';
import L from 'leaflet';
import tileLayer from './tileLayer';
import "leaflet.heat";

const center = [52.07221, -1.01463];
const backendUrl = process.env.REACT_APP_ENV === "prod" ? "http://localhost:8080" : 'http://localhost:8080';
var selectionMarker;
var legendElement;
var reportAddedTime = 0;

const renderHeatmap = (map) => {
  console.log("rendering heatmap")
  console.log(process.env)
  try {
    fetch(`${backendUrl}/api/safetyheatmap/heatmap/get`, {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: `S`,
          range: {
            topleft: {
              lat: 1,
              lng: 1
            },
            bottomright: {
              lat: 1,
              lng: 1
            }
          }
        })
      })
      .then(response => {
        if (response.status === 200) {
          response.json().then(json => {
            // Add Heatmap
            removeHeatlayer(map);
            var points = json.points;
            var heatLayer = L.heatLayer(points)
            heatLayer.addTo(map);

            // Add Marks
            var icon;
            var marker;
            for (var i = 0; i < points.length; i++){
              var p = points[i];
              if (p.age <= 15 * 60) {
                icon = createIconMark();
                marker = new L.marker([p.lat, p.lng], { icon: icon });
                marker.addTo(map);
              }
              else if (p.age <= 60 * 60) {
                icon = createIconMarkLow();
                marker = new L.marker([p.lat, p.lng], { icon: icon });
                marker.addTo(map);
              }
            }
          })
        }
        else {
          console.error(response);
        }
      });
  } catch (error) {
    console.error(error);
  }
}

const canAddReport = () => {
  return Date.now() / 1000 - reportAddedTime > 5
}

const reportUnsafe = (map, popup) => { // https://reactnative.dev/docs/network
  if (canAddReport() !== true) {
    showInfo(map, "You recently submitted a report ⏳", "yellow");
    return;
  }
  
  reportAddedTime = Date.now() / 1000;
  try {
    fetch(`${backendUrl}/api/safetyheatmap/report/add`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(popup.getLatLng())
      })
      .then(response => {
        if (response.status === 201) {
          showInfo(map, "Thank you for your report 👍", "green");
          removeAllMarkers(map);
          renderHeatmap(map);
        }
        else {
          showInfo(map, "Something went wrong ❌", "red");
          console.error(response);
        }
      })
  } catch (error) {
    console.error(error);
    showInfo(map, "Something went wrong ❌", "red");
  }
}

const removeHeatlayer = (map) => {
  map.eachLayer((layer) => {
    if (layer.options && layer.options.pane === "overlayPane") {
      map.removeLayer(layer);
    }
  });
}

const removeAllMarkers = (map) => {
  map.eachLayer((layer) => {
    if (layer.options && layer.options.pane === "markerPane") {
      map.removeLayer(layer);
    }
  });
}

function createIconMarkLow() {
  return L.divIcon({
    className: "custom-icon-mark-low",
    iconSize: L.point(24, 24),
    html: `<svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="-6.7 0 15 10" width=100% height=100%><path stroke-width:4; stroke:rgb(0, 0, 0); fill-rule="evenodd" clip-rule="evenodd" d="M1 10C0.4477 10 0 9.5523 0 9C0 8.4477 0.4477 8 1 8C1.5523 8 2 8.4477 2 9C2 9.5523 1.5523 10 1 10zM1 0C1.5523 0 2 0.44772 2 1V6C2 6.5523 1.5523 7 1 7C0.4477 7 0 6.5523 0 6V1C0 0.44772 0.4477 0 1 0z" fill="#000000"/></svg>`,
    iconAnchor: [12, 12],
  });
}

function createIconMark() {
  return L.divIcon({
    className: "custom-icon-mark",
    iconSize: L.point(24, 24),
    html: `<svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="-6.7 0 15 10" width=100% height=100%><path stroke-width:4; stroke:rgb(0, 0, 0); fill-rule="evenodd" clip-rule="evenodd" d="M1 10C0.4477 10 0 9.5523 0 9C0 8.4477 0.4477 8 1 8C1.5523 8 2 8.4477 2 9C2 9.5523 1.5523 10 1 10zM1 0C1.5523 0 2 0.44772 2 1V6C2 6.5523 1.5523 7 1 7C0.4477 7 0 6.5523 0 6V1C0 0.44772 0.4477 0 1 0z" fill="#000000"/></svg>`,
    iconAnchor: [12, 12],
  });
}

function createIcon() {
  return L.divIcon({
    className: "custom-icon-marker",
    iconSize: L.point(40, 40),
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker"><path fill-opacity="0.25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/><path stroke="#000000" fill="#e83e4c" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/></svg>`,
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

const ShowMarkers = ({ map, points }) => {
  const [ popup, setPopup ] = useState()
  return points.map((point, index) => {
    return <Marker
      icon={createIcon()}
      key={index}
      uniceid={index}
      position={point}
      draggable={true}
      eventHandlers={{
        moveend(e) {
          // const { lat, lng } = e.target.getLatLng();
        },
        add(e) {
          selectionMarker = e.target;
          var popup = e.target.getPopup();
          popup.setLatLng(e.target.getLatLng());
          map.openPopup(popup);
          setPopup(popup);
        }
      }}
    >
      <Popup>
        <Button type='unsafe pill lg popup' text='Report Unsafe' onClickAction={() => { reportUnsafe(map, popup); selectionMarker.remove(); }} />
        <Button type='pill lg popup' text='❌ Cancel' onClickAction={() => selectionMarker.remove()} />
      </Popup>
    </Marker>
  })
}

function showInfo(map, text, color = "") {
  if (legendElement) legendElement.remove();
  legendElement = L.control({ position: "bottomleft" });
  const info = L.DomUtil.create("h1", "legend " + color);

  legendElement.onAdd = () => {
    info.textContent = "  " + text + "  ";
    return info;
  };
  legendElement.addTo(map);
}

const MyMarkers = ({ map }) => {
  const [marker, setMarker] = useState([])

  useEffect(() => {
    if (!map) return;
    renderHeatmap(map);
    showInfo(map, `Press on the map to add a report 👆`);

    map.on('click', (e) => {
      if (selectionMarker) selectionMarker.remove();
      if (canAddReport()) {
        const { lat, lng } = e.latlng;
        setMarker(mar => [...mar, [lat, lng]]);
      }
      else {
        showInfo(map, "You recently submitted a report ⏳", "yellow");
      }
    })

  }, [map]);

  return marker.length > 0 ? (
    <ShowMarkers
      map={map}
      points={marker} />
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
  );
}

export default MapWrapper;
