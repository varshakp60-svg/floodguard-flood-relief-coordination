
import React, { useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { enableNotifications } from "../utils/notifications";

export default function Navbar() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    "Notification" in window && Notification.permission === "granted"
  );

  const handleEnableNotifications = async () => {
    const enabled = await enableNotifications();
    setNotificationsEnabled(enabled);
  };

  return (
    <header className="topbar">
      <div>
        <h3>
          Detect <span>•</span> Alert <span>•</span>
          Coordinate <span>•</span> Save Lives
        </h3>
        <p>Flood monitoring and relief coordination platform</p>
      </div>

      <div className="topbar-right">
        <span className="live-status">
          <i /> Live Updates
        </span>

        <span className="topbar-user">
          <CircleUserRound size={22} />
          {user?.name}
        </span>

        <button
          type="button"
          onClick={handleEnableNotifications}
          title="Enable browser notifications and alert sound"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 12px",
            borderRadius: "8px",
            border: "1px solid #d5e1ef",
            background: notificationsEnabled ? "#e8f7ee" : "#ffffff",
            color: notificationsEnabled ? "#168447" : "#1769aa",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          <Bell size={19} />
          {notificationsEnabled ? "Notifications On" : "Enable Alerts"}
        </button>
      </div>
    </header>
  );
}
