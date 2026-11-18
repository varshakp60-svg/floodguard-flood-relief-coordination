
import React from "react";
import { MapPin, Clock } from "lucide-react";

export default function RequestCard({ request }) {
  return (
    <div className="request-card">
      <div className="request-heading">
        <strong>{request.title}</strong>
        <span className={`status ${request.status.toLowerCase().replace(" ", "-")}`}>
          {request.status}
        </span>
      </div>

      <p>{request.description}</p>

      <div className="request-meta">
        <span><MapPin size={15} /> {request.location}</span>
        <span><Clock size={15} /> {request.date}</span>
      </div>

      {request.image && (
        <img
          src={request.image}
          alt="Disaster evidence"
          className="request-image"
        />
      )}
    </div>
  );
}
