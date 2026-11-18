
import React from "react";
import { AlertTriangle, Info } from "lucide-react";

export default function AlertBanner({ alert }) {
  const critical = alert.severity === "Critical";
  const warning = alert.severity === "Warning";

  return (
    <div className={`alert-banner ${
      critical ? "critical" : warning ? "warning" : "advisory"
    }`}>
      {critical || warning
        ? <AlertTriangle size={23} />
        : <Info size={23} />}

      <div className="alert-content">
        <strong>{alert.title}</strong>
        <p>{alert.location} — {alert.message}</p>
      </div>

      <span className="alert-time">{alert.time}</span>
    </div>
  );
}
