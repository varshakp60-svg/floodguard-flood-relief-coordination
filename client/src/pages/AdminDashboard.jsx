
import React, { useEffect, useState } from "react";
import {
  Users, AlertTriangle, MapPin, HeartHandshake,
  ClipboardList, Plus, CheckCircle
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import AlertBanner from "../components/AlertBanner";
import ReliefMap from "../components/ReliefMap";
import { api } from "../api/api";

export default function AdminDashboard({
  reports,
  tasks,
  centers,
  alerts,
  addAlert,
  updateReport,
  addTask,
  addCenter
}) {
  const [alertForm, setAlertForm] = useState({
    title: "",
    location: "",
    message: "",
    severity: "Warning"
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    location: "",
    description: "",
    priority: "Medium",
    assignedTo: ""
  });

  const [centerForm, setCenterForm] = useState({
    name: "", location: "", capacity: "", availableSlots: "",
    contact: "", lat: "", lng: ""
  });
  const [centerLoading, setCenterLoading] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

  // FETCH REGISTERED VOLUNTEERS
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setVolunteerLoading(true);

        const response = await api.getVolunteers();

        setVolunteers(response.volunteers || []);
      } catch (error) {
        alert(error.message || "Failed to load volunteers");
      } finally {
        setVolunteerLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const publishAlert = async (e) => {
    e.preventDefault();

    if (
      !alertForm.title.trim() ||
      !alertForm.location.trim() ||
      !alertForm.message.trim()
    ) {
      alert("Fill all alert details");
      return;
    }

    const severityMap = {
      Critical: "critical",
      Warning: "high",
      Advisory: "low"
    };

    try {
      setAlertLoading(true);

      const response = await api.createAlert({
        title: alertForm.title.trim(),
        location: alertForm.location.trim(),
        message: alertForm.message.trim(),
        severity: severityMap[alertForm.severity]
      });

      const savedAlert = {
        ...response.alert,
        id: response.alert._id,
        severity: alertForm.severity,
        time: "Just now"
      };

      addAlert(savedAlert);

      setAlertForm({
        title: "",
        location: "",
        message: "",
        severity: "Warning"
      });

      alert("Emergency alert published and saved successfully!");

    } catch (error) {
      alert(error.message || "Failed to publish alert");
    } finally {
      setAlertLoading(false);
    }
  };

  // ADD A RELIEF CENTER TO MONGODB
  const submitCenter = async (e) => {
    e.preventDefault();
    const capacity = Number(centerForm.capacity);
    const availableSlots = Number(centerForm.availableSlots);
    const lat = Number(centerForm.lat);
    const lng = Number(centerForm.lng);

    if (!centerForm.name.trim() || !centerForm.location.trim() ||
        !Number.isInteger(capacity) || capacity < 1 ||
        !Number.isInteger(availableSlots) || availableSlots < 0 || availableSlots > capacity ||
        !Number.isFinite(lat) || Math.abs(lat) > 90 ||
        !Number.isFinite(lng) || Math.abs(lng) > 180) {
      alert("Enter valid center details, capacity, available slots and GPS coordinates.");
      return;
    }

    try {
      setCenterLoading(true);
      const response = await api.createReliefCenter({
        ...centerForm, capacity, availableSlots, lat, lng
      });
      addCenter(response.center);
      setCenterForm({ name: "", location: "", capacity: "", availableSlots: "", contact: "", lat: "", lng: "" });
      alert("Relief center saved successfully!");
    } catch (error) {
      alert(error.message || "Failed to add relief center");
    } finally {
      setCenterLoading(false);
    }
  };

  // ASSIGN TASK TO A REGISTERED VOLUNTEER
  const assignTask = async (e) => {
    e.preventDefault();

    if (
      !taskForm.title.trim() ||
      !taskForm.location.trim() ||
      !taskForm.description.trim() ||
      !taskForm.assignedTo
    ) {
      alert("Fill all task details and select a volunteer");
      return;
    }

    try {
      setTaskLoading(true);

      const response = await api.assignTask({
        title: taskForm.title.trim(),
        location: taskForm.location.trim(),
        description: taskForm.description.trim(),
        assignedTo: taskForm.assignedTo
      });

      addTask(response.task);

      setTaskForm({
        title: "",
        location: "",
        description: "",
        priority: "Medium",
        assignedTo: ""
      });

      alert("Volunteer task assigned and saved successfully!");

    } catch (error) {
      alert(error.message || "Failed to assign task");
    } finally {
      setTaskLoading(false);
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
              <h1>Emergency Control Dashboard</h1>
              <p>Monitor flood situations and coordinate relief operations.</p>
            </div>
            <span className="emergency-label">Admin Control</span>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Disaster Reports"
              value={reports.length}
              icon={ClipboardList}
              color="blue"
              note="Reported incidents"
            />

            <StatCard
              title="Critical Alerts"
              value={alerts.filter(a => a.severity === "Critical").length}
              icon={AlertTriangle}
              color="red"
              note="Emergency warnings"
            />

            <StatCard
              title="Relief Centers"
              value={centers.length}
              icon={HeartHandshake}
              color="green"
              note="Registered shelters"
            />

            <StatCard
              title="Volunteer Tasks"
              value={tasks.length}
              icon={Users}
              color="orange"
              note="Assigned activities"
            />
          </div>

          <section className="panel" id="alerts">
            <div className="section-heading">
              <div>
                <h2><AlertTriangle size={21} /> Emergency Alerts</h2>
                <p>Current disaster and weather warnings.</p>
              </div>
            </div>

            <div className="alert-list">
              {alerts.map(alert => (
                <AlertBanner
                  key={alert.id || alert._id}
                  alert={alert}
                />
              ))}
            </div>

            <form className="inline-form" onSubmit={publishAlert}>
              <h3>Publish New Alert</h3>

              <input
                placeholder="Alert title"
                value={alertForm.title}
                onChange={e =>
                  setAlertForm({ ...alertForm, title: e.target.value })
                }
              />

              <input
                placeholder="Location"
                value={alertForm.location}
                onChange={e =>
                  setAlertForm({ ...alertForm, location: e.target.value })
                }
              />

              <input
                placeholder="Alert message"
                value={alertForm.message}
                onChange={e =>
                  setAlertForm({ ...alertForm, message: e.target.value })
                }
              />

              <select
                value={alertForm.severity}
                onChange={e =>
                  setAlertForm({ ...alertForm, severity: e.target.value })
                }
              >
                <option>Critical</option>
                <option>Warning</option>
                <option>Advisory</option>
              </select>

              <button
                className="primary-button"
                disabled={alertLoading}
              >
                <Plus size={17} />
                {alertLoading ? "Publishing..." : "Publish Alert"}
              </button>
            </form>
          </section>

          <section className="panel" id="map">
            <div className="section-heading">
              <div>
                <h2><MapPin size={21} /> Live Flood & Relief Map</h2>
                <p>Red markers: disaster reports · Green markers: relief centers</p>
              </div>
            </div>
            <ReliefMap reports={reports} centers={centers} />
          </section>

          <section className="panel" id="reports">
            <div className="section-heading">
              <div>
                <h2>Citizen Disaster Reports</h2>
                <p>Review reported emergencies and update response status.</p>
              </div>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Disaster</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Relief Team</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map(report => (
                    <tr key={report.id || report._id}>
                      <td>
                        <strong>{report.title}</strong>
                        {report.image && (
                          <a href={report.image} target="_blank" rel="noreferrer">
                            <br />View photo
                          </a>
                        )}
                      </td>

                      <td>{report.location}</td>
                      <td><span className="severity">{report.severity}</span></td>
                      <td>{report.requestTeam ? "Requested" : "Not requested"}</td>
                      <td>{report.status}</td>

                      <td>
                        <select
                          value={report.status}
                          onChange={e =>
                            updateReport(report.id, e.target.value)
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel" id="centers">
            <h2>Relief Centers</h2>
            <form className="inline-form" onSubmit={submitCenter}>
              <h3>Add New Relief Center</h3>
              <input placeholder="Center name" value={centerForm.name} onChange={e => setCenterForm({ ...centerForm, name: e.target.value })} required />
              <input placeholder="Address / location" value={centerForm.location} onChange={e => setCenterForm({ ...centerForm, location: e.target.value })} required />
              <input type="number" min="1" placeholder="Total capacity" value={centerForm.capacity} onChange={e => setCenterForm({ ...centerForm, capacity: e.target.value })} required />
              <input type="number" min="0" placeholder="Available slots" value={centerForm.availableSlots} onChange={e => setCenterForm({ ...centerForm, availableSlots: e.target.value })} required />
              <input placeholder="Contact number (optional)" value={centerForm.contact} onChange={e => setCenterForm({ ...centerForm, contact: e.target.value })} />
              <input type="number" step="any" placeholder="Latitude (GPS)" value={centerForm.lat} onChange={e => setCenterForm({ ...centerForm, lat: e.target.value })} required />
              <input type="number" step="any" placeholder="Longitude (GPS)" value={centerForm.lng} onChange={e => setCenterForm({ ...centerForm, lng: e.target.value })} required />
              <button className="primary-button" disabled={centerLoading}>
                <Plus size={17} /> {centerLoading ? "Saving..." : "Add Relief Center"}
              </button>
              <small>Enter GPS latitude and longitude so the center appears on the map.</small>
            </form>

            <div className="center-grid">
              {centers.map(center => (
                <div className="center-card" key={center.id || center._id}>
                  <HeartHandshake size={26} />
                  <h3>{center.name}</h3>
                  <p>{center.location}</p>
                  <strong>
                    {center.availableSlots ?? center.available}/{center.capacity} spaces available
                  </strong>
                  <span>{center.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" id="volunteers">
            <h2>Volunteer Task Coordination</h2>

            <form className="inline-form" onSubmit={assignTask}>
              <h3>Create New Volunteer Task</h3>

              <input
                placeholder="Task title"
                value={taskForm.title}
                onChange={e =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
              />

              <input
                placeholder="Task location"
                value={taskForm.location}
                onChange={e =>
                  setTaskForm({ ...taskForm, location: e.target.value })
                }
              />

              <input
                placeholder="Task description"
                value={taskForm.description}
                onChange={e =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
              />

              <select
                value={taskForm.priority}
                onChange={e =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <select
                value={taskForm.assignedTo}
                onChange={e =>
                  setTaskForm({ ...taskForm, assignedTo: e.target.value })
                }
                disabled={volunteerLoading}
              >
                <option value="">
                  {volunteerLoading
                    ? "Loading volunteers..."
                    : "Select a volunteer"}
                </option>

                {volunteers.map(volunteer => (
                  <option key={volunteer._id} value={volunteer._id}>
                    {volunteer.name} ({volunteer.email})
                  </option>
                ))}
              </select>

              {!volunteerLoading && volunteers.length === 0 && (
                <p>No registered volunteers found.</p>
              )}

              <button
                className="primary-button"
                disabled={taskLoading || volunteerLoading || volunteers.length === 0}
              >
                <Plus size={17} />
                {taskLoading ? "Assigning..." : "Assign Task"}
              </button>
            </form>

            {tasks.map(task => (
              <div className="completed-row" key={task.id || task._id}>
                {task.status === "Completed"
                  ? <CheckCircle size={20} />
                  : <ClipboardList size={20} />}

                <span>
                  {task.title} — {task.location} ({task.status})
                </span>

                {task.proof && (
                  <a href={task.proof} target="_blank" rel="noreferrer">
                    View proof
                  </a>
                )}
              </div>
            ))}
          </section>

          <section className="panel" id="analytics">
            <h2>Relief Statistics</h2>

            <div className="stats-grid">
              <StatCard
                title="Pending Reports"
                value={reports.filter(r => r.status === "Pending").length}
                icon={ClipboardList}
                color="orange"
              />

              <StatCard
                title="Resolved Reports"
                value={reports.filter(r => r.status === "Resolved").length}
                icon={CheckCircle}
                color="green"
              />

              <StatCard
                title="Completed Tasks"
                value={tasks.filter(t => t.status === "Completed").length}
                icon={Users}
                color="blue"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
