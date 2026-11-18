
import React from "react";

export default function StatCard({ title, value, icon: Icon, color, note }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={27} />
      </div>

      <div className="stat-details">
        <h2>{value}</h2>
        <p>{title}</p>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}
