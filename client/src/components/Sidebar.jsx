
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Bell, MapPin, Users,
  HeartHandshake, BarChart3, LogOut,
  ClipboardList, Camera
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menus = {
    Admin: [
      ["Dashboard", "/admin", LayoutDashboard],
      ["Alerts", "/admin#alerts", Bell],
      ["Map View", "/admin#map", MapPin],
      ["Disaster Reports", "/admin#reports", ClipboardList],
      ["Relief Centers", "/admin#centers", HeartHandshake],
      ["Volunteers", "/admin#volunteers", Users],
      ["Analytics", "/admin#analytics", BarChart3]
    ],
    Citizen: [
      ["Dashboard", "/citizen", LayoutDashboard],
      ["Report Disaster", "/citizen#report", Camera],
      ["My Requests", "/citizen#requests", ClipboardList],
      ["Relief Centers", "/citizen#centers", HeartHandshake]
    ],
    Volunteer: [
      ["Dashboard", "/volunteer", LayoutDashboard],
      ["Assigned Tasks", "/volunteer#tasks", ClipboardList],
      ["Completed Tasks", "/volunteer#completed", Camera]
    ]
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <HeartHandshake size={32} />
        </div>
        <h2>Flood Alert</h2>
        <small>& Relief Coordination</small>
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <strong>{user?.name}</strong>
          <small>{user?.role}</small>
        </div>
      </div>

      <nav className="side-menu">
        {(menus[user?.role] || []).map(([label, path, Icon]) => (
          <NavLink
            key={label}
            to={path}
            className="side-link"
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="safety-box">
          <HeartHandshake size={28} />
          <strong>Together for a Safer Community</strong>
          <small>Every action saves lives.</small>
        </div>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
