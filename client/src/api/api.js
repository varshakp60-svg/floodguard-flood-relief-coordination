

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("floodUser") || "null");
  return user?.token || localStorage.getItem("token") || "";
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  baseURL: API_URL,

  // Authentication
  register: (data) => request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  login: (data) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  getVolunteers: () => request("/auth/volunteers"),
  // Flood reports
  getReports: () => request("/reports"),

  createReport: (data) => request("/reports", {
    method: "POST",
    body: data
  }),

  // Emergency alerts
  getAlerts: () => request("/alerts"),

  createAlert: (data) => request("/alerts", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  updateAlert: (id, data) => request(`/alerts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),

  // Relief centers
  getReliefCenters: () => request("/relief-centers"),

  createReliefCenter: (data) => request("/relief-centers", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  updateReliefCenter: (id, data) => request(`/relief-centers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),

  // Volunteer tasks
  getTasks: () => request("/tasks"),

  assignTask: (data) => request("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  updateTaskStatus: (id, data) => request(`/tasks/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),

  completeTask: (id, formData) => request(`/tasks/${id}/status`, {
    method: "PUT",
    body: formData
  })
};
