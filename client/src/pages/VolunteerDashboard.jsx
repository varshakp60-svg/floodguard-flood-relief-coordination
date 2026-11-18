
import React, { useState } from "react";
import {
  ClipboardList, CheckCircle, Camera, Upload, MapPin
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function VolunteerDashboard({ tasks, updateTask }) {
  const [proofs, setProofs] = useState({});

  const uploadProof = (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Image must be below 3 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProofs(prev => ({ ...prev, [id]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const completeTask = (task) => {
    if (!proofs[task.id]) {
      alert("Upload a photograph as proof before completing the task.");
      return;
    }

    updateTask(task.id, {
      status: "Completed",
      proof: proofs[task.id]
    });

    alert("Task completed and proof submitted!");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <Navbar />

        <div className="page-content">
          <div className="welcome-section">
            <div>
              <h1>Volunteer Dashboard</h1>
              <p>Manage your relief activities and help affected communities.</p>
            </div>
            <span className="emergency-label">Volunteer Portal</span>
          </div>

          <div className="volunteer-stats">
            <div className="mini-stat">
              <ClipboardList size={25} />
              <div>
                <h2>{tasks.length}</h2>
                <p>Total Tasks</p>
              </div>
            </div>

            <div className="mini-stat">
              <Camera size={25} />
              <div>
                <h2>{tasks.filter(t => t.status !== "Completed").length}</h2>
                <p>Pending Tasks</p>
              </div>
            </div>

            <div className="mini-stat">
              <CheckCircle size={25} />
              <div>
                <h2>{tasks.filter(t => t.status === "Completed").length}</h2>
                <p>Completed Tasks</p>
              </div>
            </div>
          </div>

          <section className="panel" id="tasks">
            <div className="section-heading">
              <div>
                <h2>Assigned Relief Tasks</h2>
                <p>Complete your tasks and upload photographic evidence.</p>
              </div>
            </div>

            <div className="task-grid">
              {tasks.map(task => (
                <div className="task-card" key={task.id}>
                  <div className="task-top">
                    <span className="task-icon">
                      <HeartHandshakeIcon />
                    </span>
                    <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>
                  </div>

                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <div className="task-location">
                    <MapPin size={16} /> {task.location}
                  </div>

                  <p className="priority">
                    Priority: <strong>{task.priority}</strong>
                  </p>

                  {task.status !== "Completed" ? (
                    <>
                      {task.status === "Assigned" && (
                        <button
                          className="primary-button full-button"
                          onClick={() => updateTask(task.id, { status: "Accepted" })}
                        >
                          Accept Task
                        </button>
                      )}

                      {task.status === "Accepted" && (
                        <button
                          className="secondary-button full-button"
                          onClick={() => updateTask(task.id, { status: "In Progress" })}
                        >
                          Start Task
                        </button>
                      )}

                      {task.status === "In Progress" && (
                        <>
                          <label className="upload-box task-upload">
                            <Upload size={23} />
                            Upload Completion Proof
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              hidden
                              onChange={e => uploadProof(task.id, e)}
                            />
                          </label>

                          {proofs[task.id] && (
                            <img
                              className="upload-preview"
                              src={proofs[task.id]}
                              alt="Task completion proof"
                            />
                          )}

                          <button
                            className="primary-button full-button"
                            onClick={() => completeTask(task)}
                          >
                            <CheckCircle size={18} /> Submit Completed Task
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="completed-message">
                        <CheckCircle size={19} /> Task completed successfully
                      </div>
                      {task.proof && (
                        <img
                          className="upload-preview"
                          src={task.proof}
                          alt="Submitted completion proof"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="panel" id="completed">
            <h2>Completed Activities</h2>
            {tasks.filter(t => t.status === "Completed").map(task => (
              <div className="completed-row" key={task.id}>
                <CheckCircle size={20} />
                <span>{task.title} – {task.location}</span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

function HeartHandshakeIcon() {
  return <ClipboardList size={25} />;
}
