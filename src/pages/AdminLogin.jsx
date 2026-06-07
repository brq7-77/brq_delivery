import { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

export default function AdminLogin({ onLogin, onBack }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    console.log("LOGIN TRY:", cleanIdentifier, cleanPassword);

    const { data, error } = await supabase
      .from("supervisors")
      .select("*");

    console.log("SUPERVISORS:", data, error);

    if (error) {
      toast.error("Database error");
      return;
    }

    const userRow = data?.find(
      (u) =>
        u.active === true &&
        (u.username === cleanIdentifier || u.email === cleanIdentifier) &&
        u.password === cleanPassword
    );

    console.log("FOUND USER:", userRow);

    if (!userRow) {
      toast.error("Wrong username or password");
      return;
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      username: userRow.username,
      email: userRow.email,
      role: userRow.role,
      active: userRow.active,
    };

    localStorage.setItem("brq_admin_token", "supabase-local-token");
    localStorage.setItem("brq_admin_user", JSON.stringify(user));

    toast.success("Welcome back commander");
    onLogin(user);
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