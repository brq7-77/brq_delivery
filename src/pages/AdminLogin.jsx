import { useState } from "react";
import { adminLogin } from "../api";
import toast from "react-hot-toast";

export default function AdminLogin({ onLogin, onBack }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await adminLogin(identifier, password);

    if (!data.success) {
      toast.error(data.message || "Login failed");
      return;
    }

    localStorage.setItem("brq_admin_token", data.token);
    localStorage.setItem("brq_admin_user", JSON.stringify(data.user));

    toast.success("Welcome back commander");

    onLogin(data.user);
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

        <p className="eyebrow">BRQ Control Center</p>
        <h1>Admin Login</h1>

        <label>
          Email or Username
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="baraa or admin@brq.delivery"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit">
          <i className="fa-solid fa-right-to-bracket"></i>
          Login
        </button>

        <button type="button" className="login-back" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          Back to Store
        </button>
      </form>
    </main>
  );
}