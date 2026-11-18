
import React, { useState } from "react";
import {
  Camera,
  MapPin,
  Send,
  Upload,
  HeartHandshake,
  AlertTriangle,
  ShieldCheck,
  BookOpen
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import ReliefMap from "../components/ReliefMap";

export default function CitizenDashboard({
  reports,
  centers,
  alerts = [],
  addReport
}) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    severity: "High",
    requestTeam: true
  });

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState(null);

  const update = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload an image below 3 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageFile(file);
    };

    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        setForm(prev => ({
          ...prev,
          location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        }));
      },
      () => alert("Please allow location access")
    );
  };

  const submitReport = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      await addReport({
        ...form,
        imageFile,
        lat: coords?.lat || null,
        lng: coords?.lng || null
      });

      setForm({
        title: "",
        location: "",
        description: "",
        severity: "High",
        requestTeam: true
      });

      setImage("");
      setImageFile(null);
      setCoords(null);

      alert("Your disaster report has been submitted!");

    } catch (error) {
      alert(error.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <Navbar />

        <div className="page-content">

          <div className="welcome-section">
            <div>
              <h1>Citizen Dashboard</h1>
              <p>Report emergencies and get help from relief teams.</p>
            </div>
            <span className="emergency-label">
              Emergency Support
            </span>
          </div>

          {/* Emergency Alerts */}
          <section className="panel" id="alerts">
            <div className="section-heading">
              <div>
                <h2>
                  <AlertTriangle size={21} />
                  Emergency Alerts
                </h2>
                <p>Latest flood alerts published by the Admin.</p>
              </div>

              <span className="count-badge">
                {alerts.length}
              </span>
            </div>

            <div className="request-list">
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <div
                    className="center-card"
                    key={alert._id || alert.id}
                  >
                    <AlertTriangle
                      size={23}
                      color={
                        ["Critical", "Warning"].includes(alert.severity)
                          ? "#ef4444"
                          : "#eab308"
                      }
                    />

                    <h3>{alert.title}</h3>
                    <p>{alert.message}</p>

                    <p>
                      <MapPin size={15} />
                      {" "}{alert.location}
                    </p>

                    <strong>
                      Severity: {alert.severity}
                    </strong>

                    <small>
                      {alert.time ||
                        (alert.createdAt
                          ? new Date(alert.createdAt).toLocaleString()
                          : "Recently")}
                    </small>
                  </div>
                ))
              ) : (
                <p>No active emergency alerts at the moment.</p>
              )}
            </div>
          </section>

          {/* Flood Safety Instructions */}
          <section className="panel" id="safety">
            <div className="section-heading">
              <div>
                <h2>
                  <ShieldCheck size={22} />
                  Flood Safety Instructions
                </h2>
                <p>
                  Learn how to protect yourself and your family
                  before, during and after a flood.
                </p>
              </div>
              <BookOpen size={27} color="#1682f8" />
            </div>

            <div className="safety-grid">

              {/* Before Flood */}
              <div className="center-card safety-card">
                <h3>🟢 Before a Flood</h3>
                <p>Prepare yourself before flooding occurs.</p>

                <ul>
                  <li>Prepare an emergency kit with drinking water, food, medicines and a flashlight.</li>
                  <li>Keep important documents in waterproof bags.</li>
                  <li>Save emergency contact numbers.</li>
                  <li>Charge your mobile phone and power bank.</li>
                  <li>Follow official weather and flood warnings.</li>
                  <li>Know the nearest safe shelter or relief centre.</li>
                </ul>
              </div>

              {/* During Flood */}
              <div className="center-card safety-card">
                <h3>🔴 During a Flood</h3>
                <p>Your safety should be your first priority.</p>

                <ul>
                  <li>Move to higher ground when instructed.</li>
                  <li>Never walk, swim or drive through floodwater.</li>
                  <li>Stay away from rivers, drains and flooded roads.</li>
                  <li>Switch off electricity only if it is safe and dry to do so.</li>
                  <li>Never touch electrical equipment while standing in water.</li>
                  <li>Follow evacuation instructions from authorities.</li>
                  <li>Call emergency services if you need urgent assistance.</li>
                </ul>
              </div>

              {/* After Flood */}
              <div className="center-card safety-card">
                <h3>🔵 After a Flood</h3>
                <p>Stay careful even after floodwater recedes.</p>

                <ul>
                  <li>Return home only when authorities say it is safe.</li>
                  <li>Avoid drinking or using contaminated water.</li>
                  <li>Wear protective gloves and boots during cleanup.</li>
                  <li>Stay away from damaged electrical wires.</li>
                  <li>Do not enter damaged buildings until they are declared safe.</li>
                  <li>Report damaged roads and infrastructure.</li>
                </ul>
              </div>

            </div>

            <div className="safety-emergency-note">
              <AlertTriangle size={21} />
              <div>
                <strong>Emergency Help – India: 112</strong>
                <p>
                  For immediate emergency assistance, call 112.
                  Always follow instructions from local emergency
                  and disaster-management authorities.
                </p>
              </div>
            </div>
          </section>

          <div className="citizen-grid">

            {/* Report a Disaster */}
            <section className="panel" id="report">
              <div className="section-heading">
                <div>
                  <h2>
                    <Camera size={21} />
                    Report a Disaster
                  </h2>
                  <p>
                    Share details so emergency teams can assist you.
                  </p>
                </div>
              </div>

              <form
                onSubmit={submitReport}
                className="report-form"
              >
                <label>Disaster Title *</label>

                <input
                  name="title"
                  value={form.title}
                  onChange={update}
                  placeholder="Example: Flood water entering houses"
                  required
                />

                <label>Location *</label>

                <div className="location-input">
                  <input
                    name="location"
                    value={form.location}
                    onChange={update}
                    placeholder="Enter location"
                    required
                  />

                  <button
                    type="button"
                    className="location-button"
                    onClick={getLocation}
                  >
                    <MapPin size={18} />
                    GPS
                  </button>
                </div>

                {coords && (
                  <small className="success-text">
                    GPS location captured
                  </small>
                )}

                <label>Severity</label>

                <select
                  name="severity"
                  value={form.severity}
                  onChange={update}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <label>Description *</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={update}
                  placeholder="Explain the disaster and the help required..."
                  rows="4"
                  required
                />

                <label>Upload Disaster Photograph</label>

                <label className="upload-box">
                  <Upload size={25} />
                  <span>Choose an image or take a photo</span>
                  <small>Maximum size: 3 MB</small>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={uploadImage}
                    hidden
                  />
                </label>

                {image && (
                  <img
                    className="upload-preview"
                    src={image}
                    alt="Disaster preview"
                  />
                )}

                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    name="requestTeam"
                    checked={form.requestTeam}
                    onChange={update}
                  />

                  <HeartHandshake size={19} />
                  Request an emergency relief team
                </label>

                <button
                  className="primary-button full-button"
                  disabled={submitting}
                >
                  <Send size={18} />

                  {submitting
                    ? "Submitting..."
                    : "Submit Disaster Report"}
                </button>
              </form>
            </section>

            {/* My Disaster Reports */}
            <section className="panel" id="requests">
              <div className="section-heading">
                <div>
                  <h2>My Disaster Reports</h2>
                  <p>Track your submitted emergency reports.</p>
                </div>

                <span className="count-badge">
                  {reports.length}
                </span>
              </div>

              <div className="request-list">
                {reports.length ? (
                  reports.map(report => (
                    <RequestCard
                      key={report._id || report.id}
                      request={report}
                    />
                  ))
                ) : (
                  <p>No reports submitted yet.</p>
                )}
              </div>
            </section>

          </div>

          {/* Flood and Relief Map */}
          <section className="panel" id="map">
            <div className="section-heading">
              <div>
                <h2>
                  <MapPin size={21} />
                  Flood & Relief Map
                </h2>

                <p>
                  Red markers: disaster reports · Green markers: relief centers
                </p>
              </div>
            </div>

            <ReliefMap
              reports={reports}
              centers={centers}
            />
          </section>

          {/* Nearby Relief Centers */}
          <section className="panel" id="centers">
            <h2>Nearby Relief Centers</h2>

            <div className="center-grid">
              {centers.length > 0 ? (
                centers.map(center => (
                  <div
                    className="center-card"
                    key={center._id || center.id}
                  >
                    <HeartHandshake size={25} />

                    <h3>{center.name}</h3>
                    <p>{center.location}</p>

                    <strong>
                      {center.availableSlots ?? center.available}
                      {" "}spaces available
                    </strong>

                    <span
                      className={
                        (center.status || "").toLowerCase() === "open"
                          ? "open-status"
                          : "full-status"
                      }
                    >
                      {center.status}
                    </span>
                  </div>
                ))
              ) : (
                <p>No relief centers available currently.</p>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
