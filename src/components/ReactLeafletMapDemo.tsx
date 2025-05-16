import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const RecenterAutomatically = () => {
  const map = useMap();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position: GeolocationPosition) {
      map.setView([position.coords.latitude, position.coords.longitude]);
    }
  }, [map]);
  return null;
};

const ReactLeafletMapDemo = () => {
  return (
    <MapContainer
      doubleClickZoom={false}
      id="mapId"
      zoom={15}
      center={[20.27, -157]}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
      />
      <RecenterAutomatically />
    </MapContainer>
  );
};

export default ReactLeafletMapDemo;
