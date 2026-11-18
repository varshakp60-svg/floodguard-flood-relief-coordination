
import React from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Circle
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const makeIcon = (color) => L.divIcon({
  className: "",
  html: `<div style="background:${color};width:17px;height:17px;border:3px solid white;border-radius:50%;box-shadow:0 2px 7px #555"></div>`,
  iconSize: [23, 23],
  iconAnchor: [11, 11]
});

const hasCoordinates = (item) =>
  Number.isFinite(Number(item.lat)) &&
  Number.isFinite(Number(item.lng)) &&
  item.lat !== null &&
  item.lng !== null &&
  item.lat !== "" &&
  item.lng !== "" &&
  Math.abs(Number(item.lat)) <= 90 &&
  Math.abs(Number(item.lng)) <= 180;

export default function ReliefMap({ reports = [], centers = [] }) {
  const validReports = reports.filter(hasCoordinates);
  const validCenters = centers.filter(hasCoordinates);

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      className="relief-map"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validReports.map(report => (
        <React.Fragment key={report.id || report._id}>
          <Marker
            position={[Number(report.lat), Number(report.lng)]}
            icon={makeIcon("#ef4444")}
          >
            <Popup>
              <strong>{report.title}</strong>
              <p>{report.location}</p>
              <p>Severity: {report.severity}</p>
            </Popup>
          </Marker>

          <Circle
            center={[Number(report.lat), Number(report.lng)]}
            radius={300}
            pathOptions={{
              color: "#ef4444",
              fillOpacity: 0.12
            }}
          />
        </React.Fragment>
      ))}

      {validCenters.map(center => (
        <Marker
          key={center.id || center._id}
          position={[Number(center.lat), Number(center.lng)]}
          icon={makeIcon("#16a34a")}
        >
          <Popup>
            <strong>{center.name}</strong>
            <p>Available: {center.available ?? center.availableSlots}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
