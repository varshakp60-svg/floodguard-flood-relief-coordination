
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Users, HeartHandshake, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Citizen");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.login({
        email: email.trim(),
        password
      });

      if (response.user.role.toLowerCase() !== role.toLowerCase()) {
        alert("Please select the role registered to this account");
        return;
      }

      login(response.user, response.token);

      navigate({
        Citizen: "/citizen",
        Volunteer: "/volunteer",
        Admin: "/admin"
      }[role]);

    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { name: "Citizen", icon: Users, desc: "Report floods and request help" },
    { name: "Volunteer", icon: HeartHandshake, desc: "Coordinate relief activities" },
    { name: "Admin", icon: ShieldCheck, desc: "Manage emergency response" }
  ];

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo"><Waves size={40} /></div>
          <h1>Flood Alert <span>& Relief</span></h1>
          <p>Detect • Alert • Coordinate • Save Lives</p>
        </div>

        <h2>Welcome!</h2>
        <p className="muted">Choose your role to continue</p>

        <form onSubmit={handleLogin}>
          <label>Your Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <label>Select Your Role</label>

          <div className="role-options">
            {roles.map(item => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setRole(item.name)}
                  className={`role-option ${role === item.name ? "selected" : ""}`}
                >
                  <Icon size={25} />
                  <strong>{item.name}</strong>
                  <small>{item.desc}</small>
                </button>
              );
            })}
          </div>

          <button className="primary-button full-button" disabled={loading}>
            {loading ? "Logging in..." : "Continue to Dashboard"}
          </button>
        </form>

        <p className="login-note">Secure login · FloodGuard</p>
      </div>
    </div>
  );
}
