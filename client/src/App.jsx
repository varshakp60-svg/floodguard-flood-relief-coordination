
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import { showFloodNotification } from "./utils/notifications";
import { useAuth } from "./context/AuthContext";
import { api } from "./api/api";

import {
  initialAlerts,
  initialCenters,
  initialReports,
  initialTasks
} from "./data/mock";

function loadData(key, initialData) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialData;
  } catch {
    return initialData;
  }
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState(() =>
    loadData("floodAlerts", initialAlerts)
  );

  const [reports, setReports] = useState(() =>
    loadData("floodReports", initialReports)
  );

  const [tasks, setTasks] = useState(() =>
    loadData("volunteerTasks", initialTasks)
  );

  const [centers, setCenters] = useState(() =>
    loadData("reliefCenters", initialCenters)
  );

  // Fetch active emergency alerts from MongoDB
  useEffect(() => {
    if (!user) return;

    const fetchAlerts = async () => {
      try {
        const response = await api.getAlerts();

        const severityMap = {
          critical: "Critical",
          high: "Warning",
          medium: "Warning",
          low: "Advisory"
        };

        const savedAlerts = response.alerts.map(alert => ({
          ...alert,
          id: alert._id,
          severity:
            severityMap[alert.severity] || alert.severity,
          time: alert.createdAt
            ? new Date(alert.createdAt).toLocaleString()
            : "Recently"
        }));

        setAlerts(savedAlerts);

      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, [user]);

  // Fetch relief centers from MongoDB for every signed-in role
  useEffect(() => {
    if (!user) return;
    const fetchCenters = async () => {
      try {
        const response = await api.getReliefCenters();
        setCenters(response.centers || []);
      } catch (error) {
        console.error("Failed to fetch relief centers:", error);
      }
    };
    fetchCenters();
  }, [user]);

  // Fetch citizen reports from MongoDB
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "citizen") return;

    const fetchReports = async () => {
      try {
        const response = await api.getReports();

        const currentUserId = String(user.id || user._id);

        const myReports = response.reports
          .filter(report => {
            const reportedById =
              report.reportedBy?._id || report.reportedBy;

            return String(reportedById) === currentUserId;
          })
          .map(report => ({
            ...report,
            id: report._id,
            status:
              report.status.charAt(0).toUpperCase() +
              report.status.slice(1),
            date: new Date(report.createdAt).toLocaleString(),
            image: report.image
              ? `http://localhost:5000${report.image}`
              : ""
          }));

        setReports(myReports);

      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, [user]);

  // Save existing application data
  useEffect(() => {
    localStorage.setItem("floodAlerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("floodReports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("volunteerTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("reliefCenters", JSON.stringify(centers));
  }, [centers]);

  // Existing cross-tab flood notification feature
  useEffect(() => {
    const handleNewAlert = (event) => {
      if (event.key !== "floodAlerts" || !event.newValue) return;

      try {
        const updatedAlerts = JSON.parse(event.newValue);

        const existingIds = new Set(
          alerts.map(alert => String(alert.id))
        );

        const newAlerts = updatedAlerts.filter(
          alert => !existingIds.has(String(alert.id))
        );

        setAlerts(updatedAlerts);

        newAlerts.forEach(alert => {
          showFloodNotification({
            id: alert.id,
            title: alert.title || "Flood Emergency Alert",
            message:
              alert.message ||
              alert.description ||
              alert.location ||
              "A new flood alert has been issued."
          });
        });

      } catch (error) {
        console.error("Error receiving new flood alert:", error);
      }
    };

    window.addEventListener("storage", handleNewAlert);

    return () => {
      window.removeEventListener("storage", handleNewAlert);
    };
  }, [alerts]);

  // Submit citizen report to MongoDB
  const addReport = async (report) => {
    const formData = new FormData();

    formData.append("title", report.title);
    formData.append("description", report.description);
    formData.append("location", report.location);
    formData.append("severity", report.severity);
    formData.append("requestTeam", String(report.requestTeam));
    formData.append("lat", report.lat ?? "");
    formData.append("lng", report.lng ?? "");

    if (report.imageFile) {
      formData.append("image", report.imageFile);
    }

    const response = await api.createReport(formData);

    const savedReport = {
      ...response.report,
      id: response.report._id,
      status: "Pending",
      date: new Date(response.report.createdAt).toLocaleString(),
      image: response.report.image
        ? `http://localhost:5000${response.report.image}`
        : ""
    };

    setReports(prev => [savedReport, ...prev]);

    return savedReport;
  };

  // Existing report update function
  const updateReport = (id, status) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id ? { ...report, status } : report
      )
    );
  };

  // Existing alert function
  const addAlert = (alert) => {
    setAlerts(prev => [
      {
        ...alert,
        id: alert._id || alert.id || Date.now()
      },
      ...prev
    ]);
  };

  // Existing task function
  const addTask = (task) => {
    setTasks(prev => [
      {
        ...task,
        id: Date.now(),
        status: "Assigned",
        proof: "",
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);
  };

  const addCenter = (center) => {
    setCenters(prev => [center, ...prev]);
  };

  const updateTask = (id, changes) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...changes } : task
      )
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RoleRoute role="Admin">
            <AdminDashboard
              reports={reports}
              tasks={tasks}
              centers={centers}
              alerts={alerts}
              addAlert={addAlert}
              updateReport={updateReport}
              addTask={addTask}
              addCenter={addCenter}
            />
          </RoleRoute>
        }
      />

      <Route
        path="/citizen"
        element={
          <RoleRoute role="Citizen">
            <CitizenDashboard
              reports={reports}
              centers={centers}
              alerts={alerts}
              addReport={addReport}
            />
          </RoleRoute>
        }
      />

      <Route
        path="/volunteer"
        element={
          <RoleRoute role="Volunteer">
            <VolunteerDashboard
              tasks={tasks}
              updateTask={updateTask}
            />
          </RoleRoute>
        }
      />

      <Route
        path="/"
        element={
          user
            ? <Navigate to={`/${user.role.toLowerCase()}`} replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
