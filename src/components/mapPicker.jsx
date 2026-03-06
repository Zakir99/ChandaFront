import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function ClickHandler({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const value = `${lat}, ${lng}`;

      setPosition([lat, lng]);
      setLocation(value); // update parent input
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setLocation(`${lat}, ${lng}`);
          setPosition([lat, lng]);
        },
      }}
    />
  ) : null;
}

export default function MapPicker({ setLocation }) {

  // const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_KEY;
  return (
    <MapContainer
      zoomControl={false}
      scrollWheelZoom={true}
      zoomAnimation={true}
      fadeAnimation={true}
      center={[30.1825, 66.9591]}
      zoom={10}
      style={{ height: "250px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=qt207mGAL0qwNRUHna9x`}
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
      />

      <ClickHandler setLocation={setLocation} />
    </MapContainer>
  );
}
